// pages/salerList/salerList.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actives: [],
    active_name:'',
    active_id:0,
    active_names:[],
    datas:[],
    is_boss:true
  },
  bindPickerChange:function(e){
    console.log(e)
    var index = parseInt(e.detail.value)
    var name = this.data.actives[index].name
    var id = this.data.actives[index].id
    this.setData({
      active_name: name,
      active_id: id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var identity = wx.getStorageSync('identity')
    if (identity != 'boss') {
      return;
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
    var identity = wx.getStorageSync('identity')
    if (identity != 'boss') {
      this.setData({
        is_boss:false
      })
      wx.showModal({
        title: '提示',
        content: '您无此权限',
      })
      return;
    }
    var that = this;
    var store_id = wx.getStorageSync('store_id')
    var identity = wx.getStorageSync('identity')
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/saler',
      data: {
        token: wx.getStorageSync('token'),
        store_id: store_id,
        identity: identity
      },
      method: 'GET',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 0) {
          that.setData({
            datas: res.data.data,
            // active_num: res.data.data.active_num
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