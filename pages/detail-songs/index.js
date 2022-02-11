// pages/detail-pages/index.js

import { rankingStore } from '../../store/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ranking: "",
    rankingInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const ranking = options.ranking
    this.setData({ ranking })

    // 1.获取数据
    rankingStore.onState(ranking, this.getRankingDataHanlder)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
  },

  getRankingDataHanlder: function (res) {
    this.setData({ rankingInfo: res })
  }
})
