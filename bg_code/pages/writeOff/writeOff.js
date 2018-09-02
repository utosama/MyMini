// pages/writeOff/writeOff.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actives:[],
    active_name:'点此选择',
    active_id:0,
    active_names:[],
    date:'点此选择',
    last_time:'',
    store_id:0,
    money:-1,
    is_show:false
  },
  writeOff:function(){
    if (this.data.date == '点此选择' || this.data.active_id == 0) {
      util.showMsg('请补全信息', '')
      return
    }
    var that = this;
    if (that.data.money == 0){
      util.showMsgBack('无结算款项')
      return
    }
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/adjust-accounts',
      data: {
        token: wx.getStorageSync('token'),
        store_id: this.data.store_id,
        active_id: this.data.active_id,
        date: that.data.date,
        price: that.data.money + that.data.advance_sum
      },
      method: 'POST',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            last_time: res.data.data.last_adjust_time,
            money: res.data.data.money,
            is_show:true
          })
          util.showMsgBack('结算成功')
        }  else {
          util.showMsgBack(res.data.data)
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
  search:function(){
    if (this.data.date == '点此选择' || this.data.active_id==0){
      util.showMsg('请补全信息', '')
      return
    }
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/adjust-accounts',
      data: {
        token: wx.getStorageSync('token'),
        store_id: this.data.store_id,
        active_id: this.data.active_id
      },
      method: 'GET',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            last_time: res.data.data.last_adjust_time,
            money: res.data.data.money ,
            advance_sum: res.data.data.advance_sum
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
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange:function(e){
    var index = parseInt(e.detail.value)
    var actives = this.data.actives
    this.setData({
      active_name: actives[index].name,
      active_id: actives[index].id
    })
    console.log(this.data.active_name, this.data.active_id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var store_id = parseInt(options.store_id)
    this.setData({
      store_id: store_id
    })
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
        
        if (res.data.code == 0) {
          var active_names = []
          var data = res.data.data;
          for (var i = 0; i < data.length; i++) {
            active_names.push(data[i].name)
          }
          that.setData({
            actives: data,
            active_names: active_names
          })

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