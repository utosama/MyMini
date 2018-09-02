// pages/homeIndex/homeIndex.js
var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_boss:false,
    userinfo:{},
    amount:0,
    advance_sum:0,
    confirmText:'知道了',
    is_show:false,
    title:''
  },
  drawals:function(){
    this.setData({
      is_show:true,
      confirmText:'知道了'
    })
  },
  confirm:function(){
    this.setData({
      is_show: false
    })
  },
  next:function(){
    wx.navigateTo({
      url: '../salerList/salerList',
    })
    // if (this.data.btn_name == '分配店员') {
    //   // wx.navigateTo({
    //   //   url: '../distributeSaler/distributeSaler',
    //   // })
    //   wx.navigateTo({
    //     url: '../salerList/salerList',
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../distributeSaler/distributeSaler',
    //   })
    // }
  },
  drawals:function(){
    this.setData({
      is_show:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   
    wx.getUserInfo({
      success: res =>{
        console.log(res)
        that.setData({
          userinfo:res.userInfo
        })
      }
    })
    
    // util.WXLogin()
    var identity = wx.getStorageSync('identity')
    if (!identity) {
      wx.navigateTo({
        url: '../bind_phone/bind_phone',
      })
    }
    if (wx.getStorageSync('identity') == 'boss') {
      this.setData({
        is_boss: true
      })
    } else {
      this.setData({
        is_boss: false
      })
    }
    
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
    var that = this
    var store_id = wx.getStorageSync('store_id')
    var identity = wx.getStorageSync('identity')
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/money-view',
      data: {
        token: wx.getStorageSync('token'),
        store_id: store_id,
        // active_id: that.data.active_id,
        // data_type: data_type,
        identity: identity
      },
      method: 'GET',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.code == 0) {
          that.setData({
            amount: res.data.data.money.data.money_sum,
            advance_sum: res.data.data.money.data.advance_sum,
            title: res.data.data.confirmText
          })

        } else if (res.data.code == 2) {
          util.showMsgBack('您无权限,请联系管理员')
        } else {
          util.showMsgBack('服务器出错了！！')
        }
      },
      fail: function () {
        util.showMsgBack('服务器出错了')
      },
      complete: function () {
        if (wx.canIUse('showLoading')) {
          wx.hideLoading()
        }
      }
    })
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