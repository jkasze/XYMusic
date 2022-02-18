// pages/music-player/index.js
import { getSongDetail } from '../../service/api_player'

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.setData({ id })
    this.getPageData(id)
  },

  // 网络请求
  getPageData: function (id) {
    getSongDetail(id).then((res) => {
      this.setData({ currentSong: res.songs[0] })
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {}
})
