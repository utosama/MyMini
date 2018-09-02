// pages/storePatrol/storePatrol.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lat:0,
    lng:0,
    items: [],
    current_page:1
  },
  getItemList: function () {
      if (wx.canIUse('showLoading')) {
          wx.showLoading({
              title: '加载中……',
          })
      }
      var that = this;
      var current_page = this.data.current_page
      wx.request({
        url: app.globalData.baseUrl + '/shangmi/api/v1/stores',
          data: {
              token: wx.getStorageSync('token'),
              current_page: current_page,
              
          },
          method: 'GET',
          header: {
              'content-type': "application/x-www-form-urlencoded"
          },
          success: function (res) {
              if (res.data.code == 0) {
                  if (current_page > 1) {
                      var last_data = that.data.items
                      if (res.data.data.length != 0) {
                          var result = last_data.concat(res.data.data);
                          that.setData({
                              items: result,
                          })
                      }

                  } else if (current_page == 1) {
                      that.setData({
                          items: res.data.data,
                      })
                  }
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
  inputKeyWord: function (e) {
      var that = this;
      var current_page = this.data.current_page
      wx.request({
        url: app.globalData.baseUrl + '/shangmi/api/v1/store/search',
          data: {
              token: wx.getStorageSync('token'),
              key_word: e.detail.value,
          },
          method: 'GET',
          header: {
              'content-type': "application/x-www-form-urlencoded"
          },
          success: function (res) {
              if (res.data.code == 0) {
                  that.setData({
                      items: res.data.data,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.navigateTo({
    //   url: '../storeDetail/storeDetail',
    // })
    util.WXLogin()
  },
  next: function(e) {
    var index = e.currentTarget.dataset.index
    var item = this.data.items[index]
    console.log(item)
    wx.navigateTo({
      url: '../storeDetail/storeDetail?store_id=' + item.id + '&boss_name=' + item.boss_name + '&phone=' + item.phone,
    })
  },
  changeMsg: function(e){
    var index = e.currentTarget.dataset.index
    var item = this.data.items[index]
    wx.navigateTo({
      url: '../addStore/addStore?store_id=' + item.id,

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
      this.getItemList()
    // var that = this; 
    // wx.showLoading({
    //   title: '定位加载中……',
    // })
    // wx.getLocation({
    //   success: function(res) {
    //     that.
    //   },
    // })
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
      // var current_page = this.data.current_page
      // this.setData({
      //     current_page: current_page + 1
      // })
      // this.getItemList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})