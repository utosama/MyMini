var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    phone:'',
    screen_width:0
  },
  commitPhone:function(){
    var phone = this.data.phone;
    var token = wx.getStorageSync('token');
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
    // if(!myreg.test(phone) || phone.length != 11) 
    // { 
    //     util.showMsg('手机号格式不正确', '');
    // } 
    var that = this;
    
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/registe', 
            data: {
                'phone': phone,
                'token': wx.getStorageSync('token')
            },
            method: 'POST',
            header: {
                'content-type': "application/x-www-form-urlencoded"
            },
            success: function(res) {
              that.setData({
                  store_name:'',
                  show_btn:false
                })
              if (res.data.code == 0){
                wx.setStorageSync('identity', res.data.data.identity)
                wx.setStorageSync('store_id', res.data.data.store_id)
                wx.showModal({
                  title: '提示',
                  content: '绑定成功',
                  success: function (res) {
                    
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../record/record',
                      })
                    } else{
                      wx.switchTab({
                        url: '../record/record',
                      })
                    }
                  }
                })
              } 
              if (res.data.code == 2) {
                util.WXLogin()
              }
              if (res.data.code == 1) {
                util.showMsg(res.data.data, '')
              }
            },
            fail: function() {  
              util.showMsg('程序出错，请重试', '../homeIndex/homeIndex')
            }
          })
   
  },
  inputPhone: function(e) {
      this.setData({
        phone: e.detail.value
      })
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screen_height: res.windowHeight,
          screen_width: res.windowWidth
        })
      }
    })
    wx.setNavigationBarTitle({
      title: '输入邀请码'
    });
    // 获取用户信息
  },
})
 