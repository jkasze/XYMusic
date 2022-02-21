// pages/music-player/index.js
import { getSongDetail, getSongLyric } from '../../service/api_player'
import { audioContext } from '../../store/index'
import { parseLyric } from '../../utils/parse-lyric'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    currentTime: 0,
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: '',

    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.setData({ id })
    this.getPageData(id)
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - navBarHeight - statusBarHeight
    this.setData({ contentHeight })

    // 播放器
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true

    // audioContext的事件监听
    this.setupAudioContextListener()
  },

  // ============== 网络请求 ==============
  getPageData: function (id) {
    getSongDetail(id).then((res) => {
      this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
    })

    getSongLyric(id).then((res) => {
      const lyricString = res.lrc.lyric
      const lyrics = parseLyric(lyricString)
      this.setData({ lyricInfos: lyrics })
    })
  },

  // ============== audio监听 ==============
  setupAudioContextListener: function () {
    audioContext.onCanplay(() => {
      audioContext.play()
    })

    audioContext.onTimeUpdate(() => {
      const currentTime = audioContext.currentTime * 1000

      if (!this.data.isSliderChanging) {
        const sliderValue = (currentTime / this.data.durationTime) * 100
        this.setData({ sliderValue, currentTime })
      }

      let i = 0
      for (; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i]
        if (currentTime < lyricInfo.time) {
          break
        }
      }
      // 设置当前歌词的索引和内容
      const currentIndex = i - 1
      if (this.data.currentLyricIndex !== currentIndex) {
        const currentLyricInfo = this.data.lyricInfos[currentIndex]
        this.setData({
          currentLyricIndex: currentIndex,
          currentLyricText: currentLyricInfo.text
        })
      }
    })
  },
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
      currentTime: currentTime,
      sliderValue: value
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {}
})
