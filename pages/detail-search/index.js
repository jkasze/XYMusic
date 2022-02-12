// pages/detail-search/index.js
import { getSearchHot } from '../../service/api_search'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取页面的数据
    this.getPageData()
  },

  getPageData: function() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  }
})
