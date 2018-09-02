// pages/storeDetail/storeDetail.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_name:'店名',
    boss_name:'刘达达',
    phone: '13366026441',
    is_today:1,
    active_num:0,
    store_id: 3,
    datas:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      store_id: parseInt(options.store_id),
      boss_name: options.boss_name == 'null' ? '暂无' : options.boss_name,
      phone: options.phone ? options.phone:'暂无'
    })
    this.getData()
  },
  getData: function(){
    var data_type = 'today'
    if (this.data.is_today == 2) {
      data_type = 'all'
    } else if (this.data.is_today == 3) {
      data_type = 'history'
    }
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/store/active-overview',
      data: {
        token: wx.getStorageSync('token'),
        store_id: this.data.store_id,
        data_type: data_type
      },
      method: 'GET',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
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
  select: function(e){
    var index = parseInt(e.target.dataset.id)
    var is_today = this.data.is_today
    this.setData({
      is_today: index
    })
    this.getData()
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