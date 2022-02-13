// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest } from '../../service/api_search'
import debounce from '../../utils/debounce'

const debounceGetSearchSuggest = debounce(getSearchSuggest, 300)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    suggestSongs: [],
    searchValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取页面的数据
    this.getPageData()
  },

  // 网络请求
  getPageData: function() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
    
  },

  // 事件处理
  handleSearchChange: function(event) {
    const searchValue = event.detail
    this.setData({ searchValue })
    if (!searchValue.length) {
      this.setData({ suggestSongs: []})
      return
    }
    debounceGetSearchSuggest(searchValue).then(res => {
      this.setData({ suggestSongs: res.result.allMatch })
    })
  }
})
