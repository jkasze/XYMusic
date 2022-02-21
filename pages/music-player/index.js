// pages/music-player/index.js
import { getSongDetail } from '../../service/api_player'
import { audioContext } from '../../store/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    currentTime: 0,

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
    // audioContext.autoplay = true

    audioContext.onCanplay(() => {
      audioContext.play()
    })

    audioContext.onTimeUpdate(() => {
      const currentTime = audioContext.currentTime * 1000
      if (!this.data.isSliderChanging) {
        const sliderValue = (currentTime / this.data.durationTime) * 100
        this.setData({ sliderValue, currentTime })
      }
    })
  },

  // 网络请求
  getPageData: function (id) {
    getSongDetail(id).then((res) => {
      this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
    })
  },

  // 事件处理
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
    this.setData({ isSliderChanging: true, currentTime: currentTime })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {}
})
