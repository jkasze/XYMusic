// pages/home-music/index.js
import { rankingStore } from "../../store/ranking-store";

import { getBanners, getSongMenu } from "../../service/api_music";
import queryRect from "../../utils/query-rect";
import throttle from "../../utils/throttle";

const throttleQueryRect = throttle(queryRect);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 0,
    banners: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    recommendSongs: [],
    rankings: { 0: {}, 2: {}, 3: {} },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData();

    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction");

    // 从store获取共享的数据
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return;
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs });
    });
    rankingStore.onState("newRanking", (res) => {});
    rankingStore.onState("originRanking", (res) => {});
    rankingStore.onState("upRanking", (res) => {});
  },

  // 网络请求
  getPageData: function () {
    getBanners().then((res) => {
      this.setData({ banners: res.banners });
    });

    getSongMenu().then((res) => {
      this.setData({ hotSongMenu: res.playlists });
    });

    getSongMenu("华语").then((res) => {
      this.setData({ recommendSongMenu: res.playlists });
    });
  },

  // 事件处理
  handleSearchClick: function () {
    wx.navigateTo({
      url: "/pages/detail-search/index",
    });
  },

  handleSwiperImageLoaded: function () {
    // 获取图片组件的高度
    throttleQueryRect(".swiper-image").then((res) => {
      const rect = res[0];
      this.setData({ swiperHeight: rect.height });
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    rankingStore.offState("newRanking");
  },

  getRankingHandler: function (idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return;
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      const songList = res.tracks.slice(0, 3);
      const rankingObj = { name, coverImgUrl, playCount, songList };
      const newRankings = { ...this.data.rankings, [idx]: rankingObj };
      this.setData({
        rankings: newRankings,
      });
    };
  },
});
