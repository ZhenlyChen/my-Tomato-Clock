// pages/shop/shop.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  buyMusic: function () {
    console.log('yes')
    if (app.globalData.tomatoNum > 10) {
      app.globalData.buyMusic = new Date()
      app.globalData.tomatoNum -= 10;
      wx.setStorageSync('buyMusic', app.globalData.buyMusic)
      wx.setStorageSync('tomatoNum', app.globalData.tomatoNum)
      wx.showModal({
        title: '提示',
        content: '购买成功',
        showCancel: false,
        success: function (res) { }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '你没有足够的番茄',
        showCancel: false,
        success: function (res) { }
      })
    }
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