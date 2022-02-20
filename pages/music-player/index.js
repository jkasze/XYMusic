// pages/music-player/index.js
import { getSongDetail } from '../../service/api_player'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},

    currentPage: 0,
    contentHeight: 0
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
    const contentHeight = screenHeight - navBarHeight
    this.setData({ contentHeight })
  },

  // 网络请求
  getPageData: function (id) {
    getSongDetail(id).then((res) => {
      this.setData({ currentSong: res.songs[0] })
    })
  },

  // 事件处理
  handleSwiperChange: function (event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {}
})
