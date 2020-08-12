//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    musicPlay: false,
    hasBegin: false,
    rest: false,
    restTime: 0,
    workTime: 0,
    count: 0,
    musicIndex: 0,
    musicUrl: [
      'https://mb.zhenly.cn/res/sea.mp3',
      'https://mb.zhenly.cn/res/coffee1.mp3',
      'https://mb.zhenly.cn/res/library2.mp3',
    ]
  },
  draw: function (pre, text, dir) {  //画时钟
    pre = pre * 2 * Math.PI
    var ctx = wx.createCanvasContext('myCanvas')
    var center = app.globalData.width / 2;
    var grd = ctx.createLinearGradient(0, 0, 200, 0)
    grd.addColorStop(0, 'rgb(200, 200, 200)')
    grd.addColorStop(1, 'white')
    ctx.setStrokeStyle(grd)
    ctx.setLineWidth(4)
    ctx.setLineCap('round')
    ctx.beginPath()
    ctx.arc(center, center, center / 2, -0.5 * Math.PI, -0.5 * Math.PI + pre, dir);
    //console.log('begin:' + (-0.5 * Math.PI))
    //console.log('over:' +( -0.5 * Math.PI + pre))
    ctx.stroke();

    ctx.setFillStyle('white')
    ctx.setTextAlign('center')
    ctx.setFontSize(30)
    ctx.fillText(text, center, center + 10)
    ctx.draw()
  },
  drawBack() {  // 画背景
    var center = app.globalData.width / 2;
    var ctx = wx.createCanvasContext('myCanvas2')
    ctx.setLineWidth(4)
    ctx.setLineCap('round')
    ctx.setStrokeStyle('rgb(0, 0, 0)')
    ctx.beginPath()
    ctx.arc(center, center, center / 2, -0.5 * Math.PI, 1.5 * Math.PI);
    ctx.stroke();
    ctx.draw()
  },
  onLoad: function () { //程序加载
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      app.globalData.userInfo = userInfo
    })
    wx.getSystemInfo({
      success: function (res) {
        app.globalData.width = res.windowWidth
      }
    })
    var time = wx.getStorageSync('time')
    var rest = wx.getStorageSync('rest')
    var count = wx.getStorageSync('count')
    var musicIndex = wx.getStorageSync('musicIndex')
    var tomatoNum = wx.getStorageSync('tomatoNum')
    var tomatoToday = wx.getStorageSync('tomatoToday')
    var tomatoBad = wx.getStorageSync('tomatoBad')
    var buyMusic = wx.getStorageSync('buyMusic')

    app.globalData.tomatoNum = tomatoNum == '' ? 5 : tomatoNum
    app.globalData.tomatoToday = tomatoToday == '' ? new Date(1998,4,17) : tomatoToday
    app.globalData.buyMusic = buyMusic == '' ? new Date(1998, 4, 17) : buyMusic
    app.globalData.tomatoBad = tomatoBad == '' ? 0 : tomatoBad
    app.globalData.time = time == '' ? 45 : time
    app.globalData.rest = rest == '' ? 1 : rest
    app.globalData.count = count == '' ? 1 : count
    app.globalData.musicIndex = musicIndex == '' ? 1 : musicIndex
    if (app.globalData.tomatoNum < 0) app.globalData.tomatoNum = 0
    if (app.globalData.tomatoBad > 0) {
      var isbad = Math.ceil(Math.random() * 10) > 5
      if (isbad) {
        var num = Math.ceil(Math.random() * 3)
        app.globalData.tomatoNum -= num
        if (app.globalData.tomatoNum < 0) app.globalData.tomatoNum = 0
        wx.setStorageSync('tomatoNum', app.globalData.tomatoNum)
      }
    }
    that.drawBack()
    that.draw(app.globalData.time / 60, app.globalData.time + 'min', false)

  },
  startMusic: function () {  //开始音乐
    var that = this
    that.setData({
      musicPlay: true
    })
    wx.playBackgroundAudio({
      dataUrl: that.data.musicUrl[app.globalData.musicIndex],
      title: '尧式番茄音乐',
    })
    wx.onBackgroundAudioStop(function () {
      wx.playBackgroundAudio({
        dataUrl: that.data.musicUrl[app.globalData.musicIndex],
        title: '尧式番茄音乐',
      })
    })
  },
  stopMusic: function () {  //暂停音乐
    this.setData({
      musicPlay: false
    })
    wx.pauseBackgroundAudio()
  },
  bbYou: function () {
    var that = this
    if (app.globalData.stop == true) {
      wx.vibrateLong({
        success: function () {
          setTimeout(that.bbYou, 3000)
        }
      })
    }
  },
  running: function () {
    var that = this
    console.log('stop:' + app.globalData.stop)
    console.log('hasBegin:' + that.data.hasBegin)
    if (app.globalData.stop == true) {
      setTimeout(that.running, 1000)
      return
    }
    if (that.data.hasBegin == false) return
    if (app.globalData.rTime <= 0) {
      if (that.data.rest) {
        // 正在休息，要工作了
        app.globalData.rTime = that.data.workTime * 60
        app.globalData.maxTime = app.globalData.rTime
        that.setData({
          rest: false
        })
        app.globalData.stop = true
        that.bbYou()
        wx.showModal({
          title: '提示',
          content: '开始做野啦！',
          showCancel: false,
          confirmText: '我知道了',
          success: function (res) {
            app.globalData.stop = false
          }
        })
      } else {
        // 正在工作，要休息了
        that.setData({
          count: that.data.count - 1
        })
        //console.log('count:' + that.data.count)
        if (that.data.count <= 0) {
          // 结束
          that.setData({
            hasBegin: false
          })
          that.draw(app.globalData.time / 60, app.globalData.time + 'min', false)
          var tomato = Math.ceil(that.data.workTime / 10) * that.data.count
          app.globalData.tomatoNum += tomato;
          app.globalData.tomatoToday = new Date()
          wx.setStorageSync('tomatoNum', app.globalData.tomatoNum)
          wx.setStorageSync('tomatoToday', app.globalData.tomatoToday)
          wx.showModal({
            title: '提示',
            content: '完成任务了，得到' + tomato + '个大番茄',
            showCancel: false,
            confirmText: '我知道了',
            success: function (res) {
              app.globalData.stop = false
              wx.navigateTo({
                url: '../tomato/tomato?state=true&data=tomato',
              })
            }
          })
          return
        }
        app.globalData.rTime = that.data.restTime * 60
        app.globalData.maxTime = app.globalData.rTime
        that.setData({
          rest: true
        })
        app.globalData.stop = true
        that.bbYou()
        wx.showModal({
          title: '提示',
          content: '够钟死心了！',
          showCancel: false,
          confirmText: '我知道了',
          success: function (res) {
            app.globalData.stop = false
          }
        })
      }
      // 切换或者结束
    }
    // 继续计时
    //console.log('rtime：' + app.globalData.rTime)
    //console.log('maxtime：' + app.globalData.maxTime)
    var rTime = --app.globalData.rTime
    var min = Math.ceil(rTime / 60) - 1
    var sec = Math.ceil(rTime % 60)
    if (sec == 0) min++
    var zeroS = sec < 10 ? '0' : ''
    var zeroM = min < 10 ? '0' : ''
    var text = zeroM + min + ':' + zeroS + sec
    var pre = (app.globalData.rTime / app.globalData.maxTime)
    //console.log(pre)
    if (pre == 1) pre = 0
    if (that.data.rest) {
      that.draw(1 - pre, text, false)
    } else {
      that.draw(pre, text, false)
    }

    wx.getBackgroundAudioPlayerState({  // 处理音乐状态
      success: function (res) {
        if (res.status == 1 && that.data.musicPlay == false) {
          that.setData({
            musicPlay: true
          })
        } else if (res.status != 1 && that.data.musicPlay == true) {
          that.setData({
            musicPlay: false
          })
        }
      }
    })


    setTimeout(that.running, 1000)
  },
  startTime: function () {  // 开始
    this.setData({
      hasBegin: true,
      rest: false,
      restTime: app.globalData.rest * 5 + 5,
      count: app.globalData.count * 1 + 1,
      workTime: app.globalData.time,
      musicIndex: app.globalData.musicIndex,
    })
    app.globalData.maxTime = app.globalData.time * 60
    app.globalData.rTime = app.globalData.maxTime
    wx.setStorageSync('time', app.globalData.time)
    app.globalData.pre = app.globalData.time / 60
    this.goToAll()
  },
  goToAll: function () {
    if (app.globalData.pre < 0.95) {
      app.globalData.pre = app.globalData.pre + 0.04
      this.draw(app.globalData.pre, '开始咯', false)
      setTimeout(this.goToAll, 40)
    } else {
      this.running()
      // this.startMusic()
    }
  },
  stopTime: function () {
    if (app.globalData.pre < 0.95) return
    var that = this
    wx.showModal({
      title: '你将会得到一个烂番茄',
      content: '真的要放弃吗？还有' + Math.ceil((app.globalData.rTime / app.globalData.maxTime) * 10000) / 100 + '%就完成了',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            hasBegin: false
          })
          app.globalData.tomatoBad += 1
          wx.setStorageSync('tomatoBad', app.globalData.tomatoBad)
          that.draw(app.globalData.time / 60, app.globalData.time + 'min', false)
          // that.stopMusic()
          wx.navigateTo({
            url: '../tomato/tomato?state=failed&data=1',
          })
        }
      }
    })
  },
  moveTouch: function (e) {
    if (this.data.hasBegin) return;
    var c = app.globalData.width / 2;
    var x = e.touches[0].x
    var y = e.touches[0].y
    var angle = (y - c) / Math.sqrt((x - c) * (x - c) + (y - c) * (y - c))
    angle = Math.acos(angle)
    angle = angle / Math.PI
    if (x > c) {
      angle = (1 - angle) / 2
    } else {
      angle = (angle / 2 + 0.5)
    }
    if (Math.ceil(angle * 60) > (app.globalData.rest * 5 + 5)) {
      this.draw(angle, Math.ceil(angle * 60) + 'min', false)
      app.globalData.time = Math.ceil(angle * 60)
    }
  },
  onShow: function () {
    if (app.globalData.time <= (app.globalData.rest * 5 + 5)) {
      var angle = (app.globalData.rest * 5 + 6) / 60
      this.draw(angle, Math.ceil(angle * 60) + 'min', false)
      app.globalData.time = Math.ceil(angle * 60)
      wx.showToast({
        title: '专注时间不能少于休息时间',
        icon: 'info',
        duration: 2000
      })
    }
  },
  onHide: function(){

  }
})
