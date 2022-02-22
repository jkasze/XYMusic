// pages/music-player/index.js

import { audioContext, playerStore } from '../../store/index'

const playModeNames = ['order', 'repeat', 'random']

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,

    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',

    playModeIndex: 0,
    playModeName: 'order',
    isPlaying: false,
    playingName: 'pause',

    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.setData({ id })
    // this.getPageData(id)
    this.setupPlayerStoreListener()
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - navBarHeight - statusBarHeight
    this.setData({ contentHeight })

    // 播放器
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true

    // audioContext的事件监听
    // console.log(setupAudioContextListener)
    // this.setupAudioContextListener()
  },

  // ============== 网络请求 ==============
  // getPageData: function (id) {
  //   getSongDetail(id).then((res) => {
  //     this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
  //   })

  //   getSongLyric(id).then((res) => {
  //     const lyricString = res.lrc.lyric
  //     const lyrics = parseLyric(lyricString)
  //     this.setData({ lyricInfos: lyrics })
  //   })
  // },

  // ============== audio监听 ==============
  // setupAudioContextListener: function () {
  // audioContext.onCanplay(() => {
  //   audioContext.play()
  // })

  // audioContext.onTimeUpdate(() => {
  //   const currentTime = audioContext.currentTime * 1000

  //   if (!this.data.isSliderChanging) {
  //     const sliderValue = (currentTime / this.data.durationTime) * 100
  //     this.setData({ sliderValue, currentTime })
  //   }

  //   if (!this.data.lyricInfos.length) return
  //   let i = 0
  //   for (; i < this.data.lyricInfos.length; i++) {
  //     const lyricInfo = this.data.lyricInfos[i]
  //     if (currentTime < lyricInfo.time) {
  //       break
  //     }
  //   }
  //   // 设置当前歌词的索引和内容
  //   const currentIndex = i - 1
  //   if (this.data.currentLyricIndex !== currentIndex) {
  //     const currentLyricInfo = this.data.lyricInfos[currentIndex]
  //     this.setData({
  //       currentLyricIndex: currentIndex,
  //       currentLyricText: currentLyricInfo.text,
  //       lyricScrollTop: currentIndex * 35
  //     })
  //   }
  // })
  // },
  // ============== 事件处理 ==============
  handleSwiperChange: function (event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },

  handleSliderChange: function (event) {
    const value = event.detail.value
    const currentTime = (this.data.durationTime * value) / 100
    audioContext.pause()
    audioContext.seek(currentTime / 1000)
    this.setData({ sliderValue: value, isSliderChanging: false })
  },

  handleSliderChanging: function (event) {
    const value = event.detail.value
    const currentTime = (this.data.durationTime * value) / 100
    this.setData({
      isSliderChanging: true,
      currentTime: currentTime
    })
  },

  handleBackBtnClick: function () {
    wx.navigateBack()
  },

  handleModeClick: function () {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    playerStore.setState('playModeIndex', playModeIndex)
  },

  handlePlayBtnClick: function() {
    playerStore.dispatch('changeMusicPlayStatusAction')
  },

  // ============== 事件监听 ==============
  setupPlayerStoreListener: function () {
    // 1. 监听currentSong/durationTime/lyricInfos
    playerStore.onStates(
      ['currentSong', 'durationTime', 'lyricInfos'],
      ({ currentSong, durationTime, lyricInfos }) => {
        if (currentSong) this.setData({ currentSong })
        if (durationTime) this.setData({ durationTime })
        if (lyricInfos) this.setData({ lyricInfos })
      }
    )

    // 2. 监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(
      ['currentTime', 'currentLyricIndex', 'currentLyricText'],
      ({ currentTime, currentLyricIndex, currentLyricText }) => {
        if (currentTime && !this.data.isSliderChanging) {
          // 时间变化
          const sliderValue = (currentTime / this.data.durationTime) * 100
          this.setData({ currentTime, sliderValue })
        }
        // 歌词变化
        if (currentLyricIndex) {
          this.setData({
            currentLyricIndex,
            lyricScrollTop: currentLyricIndex * 35
          })
        }
        if (currentLyricText) {
          this.setData({ currentLyricText })
        }
      }
    )

    // 3. 监听播放模式相关的数据
    playerStore.onStates(
      ['playModeIndex', 'isPlaying'],
      ({ index, isPlaying }) => {
        if (index) {
          this.setData({
            playModeIndex: index,
            playModeName: playModeNames[index]
          })
        }

        if (isPlaying !== undefined) {
          this.setData({
            isPlaying,
            playingName: isPlaying ? 'pause' : 'resume'
          })
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {}
})
