// pages/record/record.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_today:1,
    datas: [],
    active_id: 1,
    actives: [],
    active_name: '',
    active_names: []
  },
  bindPickerChange:function(e){
    var index = parseInt(e.detail.value)
    var active_id = this.data.actives[index].id
    var ac_name = this.data.actives[index].name
    this.getData(active_id)
    this.setData({
      active_id: active_id,
      active_name: ac_name
    })
  },
  getData: function (active_id) {
    var data_type = 'today'
    if (this.data.is_today == 2) {
      data_type = 'all'
    } else if (this.data.is_today == 3){
        data_type = 'history'
    }
    var that = this;
    // var store_id = wx.getStorageSync('store_id')
    var store_id = 14
    var identity = wx.getStorageSync('identity')
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/boss/active-overview',
      data: {
        token: wx.getStorageSync('token'),
        store_id: store_id,
        active_id: active_id,
        data_type: data_type,
        identity: identity
      },
      method: 'GET',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            datas: res.data.data.actives,
            active_num: res.data.data.active_num
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
  select: function (e) {
    var index = parseInt(e.target.dataset.id)
    var is_today = this.data.is_today
    this.setData({
      is_today: index
    })
    this.getData(this.data.active_id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideTabBar({
    //   index: 1,
     
    // })
    this.setData({
      active_id: parseInt(options.id)
    })
    // this.getData()
    var identity = wx.getStorageSync('identity')
    if (!identity) {
      return;
    }
    var that = this
    var store_id = parseInt(wx.getStorageSync('store_id'))
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/active',
      data: {
        token: wx.getStorageSync('token'),
        store_id: store_id,
      },
      method: 'GET',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 0) {
          if (res.data.data.length == 0) {
            util.showMsgBack('您未参与任何活动')
            return;
          }
          var tmp = []
          for (var j = 0; j < res.data.data.length; j++) {
            tmp.push(res.data.data[j].name)
          }
          that.setData({
            actives: res.data.data,
            active_names: tmp,
            active_name: res.data.data[0].name,
            active_id: res.data.data[0].id
          })
          that.getData(res.data.data[0].id)

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