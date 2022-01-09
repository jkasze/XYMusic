// pages/home-music/index.js
import { getBanners } from '../../service/api_music'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperHeight: 0,
        banners: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取页面数据
        this.getPageDate()
    },

    // 网络请求
    getPageDate: function() {
        getBanners().then(res => {
            this.setData({ banners: res.banners })
        })
    },
    
    // 事件处理
    handleSearchClick: function() {
        wx.navigateTo({
            url: '/pages/detail-search/index'
        })
    },

    handleSwiperImageLoaded: function() {
        // 获取图片组件的高度
        const query = wx.createSelectorQuery()
        query.select('.swiper-image').boundingClientRect()
        query.exec((res) => {
            const rect =res[0]
            this.setData({ swiperHeight: rect.height })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})