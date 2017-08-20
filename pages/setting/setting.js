// pages/setting/setting.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    countList: [1, 2, 3, 4],
    timeList: ['5min', '10min', '15min', '20min', '25min', '30min'],
    musicList: ['咖啡厅白噪音', '图书馆白噪音', '海浪声'],
    countIndex: 0,
    restIndex: 1,
    musicIndex: 1,
  },
  bindPickerChangeCount: function (e) {
    this.setData({
      countIndex: e.detail.value,
    })
    app.globalData.count = e.detail.value
    wx.setStorageSync('count', e.detail.value)
  },
  bindPickerChangeRest: function (e) {
    this.setData({
      restIndex: e.detail.value,
    })
    app.globalData.rest = e.detail.value
    wx.setStorageSync('rest', e.detail.value)
  },
  bindPickerChangeMusic: function (e) {
    this.setData({
      musicIndex: e.detail.value,
    })
    app.globalData.musicIndex = e.detail.value
    wx.setStorageSync('musicIndex', e.detail.value)
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {
    var that = this
    that.setData({
      userInfo: app.globalData.userInfo,
      countIndex: app.globalData.count,
      restIndex: app.globalData.rest,
      musicIndex: app.globalData.musicIndex,
    })
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})