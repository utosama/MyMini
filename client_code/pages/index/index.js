//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    salers: [],
    active_id: 1,
    store_id:14,
    price:0,
    phone:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  click: function(e){
    var sid = e.target.dataset.sid
    var active_id = this.data.active_id
    var param = {
            token: wx.getStorageSync('token'),
            store_id: this.data.store_id,
            active_id: active_id,
            sid: sid
          }
    if (active_id == 2){
      param['phone'] = this.data.phone
    } 
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/writeoff',
      data: param,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          util.showMsgBack('核销成功')
          // wx.showToast({
          //   title: '核销成功',
          // })
        } else {
          util.showMsgBack(res.data.data)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onLoad: function (options) {
    util.WXLogin()
    var that = this;
    var active_id = 2

    if (options.active_id){
      active_id = parseInt(options.active_id)
    }
    this.setData({
      active_id: parseInt(options.active_id),
      store_id: parseInt(options.store_id)
    })
    if (this.data.active_id == 2){
      this.setData({ 
        phone: options.phone,
        store_id:14
      })
    }
    
    var data = {
      token: wx.getStorageSync('token'),
      store_id: parseInt(options.store_id),
      active_id: parseInt(options.active_id),

    }
    if (active_id==2){
      data['phone'] = options.phone
    }
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/active/salers',
      data: data,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            imgUrls: res.data.data.images,
            salers: res.data.data.salers,
            price: res.data.data.random_price
          })
        } else if (res.data.code == 3) {
            wx.reLaunch({
              url: '../haveDone/haveDone',
            })
        } else{
          util.showMsgBack(res.data.data)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
