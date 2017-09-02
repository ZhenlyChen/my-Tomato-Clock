// pages/setting/setting.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    countList: [1, 2, 3, 4],
    timeList: ['5min', '10min', '15min', '20min', '25min', '30min'],
    musicList: ['海浪声','咖啡厅白噪音', '图书馆白噪音'],
    musicListNo: ['海浪声'],
    musicListYes: ['海浪声', '咖啡厅白噪音', '图书馆白噪音'],
    countIndex: 0,
    restIndex: 1,
    musicIndex: 1,
    tomatoNum: 0,
    tomatoToday:0,
    tomatoBad: 0,
  },
  tomatoBad: function(){
    var that = this
    if (that.data.tomatoBad > 0 && that.data.tomatoNum > 0) {
      wx.showModal({
        title: '是否用一个好番茄来消灭一个烂番茄',
        content: '不消灭的话你的好番茄会随缘某时某刻烂掉几个',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              tomatoNum: that.data.tomatoNum - 1,
              tomatoBad: that.data.tomatoBad - 1,
            })
            app.globalData.tomatoNum = that.data.tomatoNum
            app.globalData.tomatoBad = that.data.tomatoBad
            wx.setStorageSync('tomatoNum', that.data.tomatoNum)
            wx.setStorageSync('tomatoBad', that.data.tomatoBad)

          }
        }
      })
    }
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
  gotoTest: function () {
    wx.navigateTo({
      url: '../shop/shop',
    })
  },

  onShow: function () {
    var that = this
    var music = (new Date()).getTime() - (new Date(app.globalData.buyMusic)).getTime()
    music = true//(music < 604800000)
    that.setData({
      userInfo: app.globalData.userInfo,
      countIndex: app.globalData.count,
      restIndex: app.globalData.rest,
      musicIndex: music ? app.globalData.musicIndex: 0,
      tomatoNum: app.globalData.tomatoNum,
      tomatoToday: (new Date()).getTime() - (new Date(app.globalData.tomatoToday)).getTime() < 86400000,
      tomatoBad: app.globalData.tomatoBad,
      musicList: music ? that.data.musicListYes : that.data.musicListNo
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