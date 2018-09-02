var app = getApp()
var util = require('../../utils/util.js')
var micro_timer;
function countdown4micro(that) {
  var second = that.data.second
  if (second <= 0) {
    that.setData({
      send_btn_name: '获取验证码',
      second: 60,
      sending:0
    })
  } else {
    micro_timer = setTimeout(function () {
      that.setData({
        second: second - 1,
        send_btn_name: second + '秒后重发'
      });
      countdown4micro(that);
    }
      , 1000)
  }
  
}
Page({
  data: {
    userInfo: {},
    phone:'',
    code:'',
    sending:0,
    send_btn_name:'获取验证码',
    second:60,
    store_id:14,
    active_id:1,
    pwd_confirm:'',
    pwd:'',
    image:'',
    newToken:'',
    height:0,
    bg:'https://share-msg.oss-cn-shanghai.aliyuncs.com/bg2.jpg'
  },
  inputCode:function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendCode:function(e) {
    var phone = this.data.phone
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    // !myreg.test(phone) ||
    if (phone[0]!='1' || phone.length != 11) {
      util.showMsg('手机号格式不正确', '');
      return
    } 
    if (this.data.sending == 1){
      return
    }
    
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/code',
      data: {
        phone: phone,
        active_id: that.data.active_id,
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      // header: {
      //   'content-type': "application/x-www-form-urlencoded"
      // },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data.msg.newToken)
          that.setData({
            sending: 1,
            newToken: res.data.msg.newToken
          })
          countdown4micro(that)
          wx.showToast({
            title: '验证码发送成功',
          })
          // wx.showModal({
          //   title: '提示',
          //   content: '发送成功',
          // })
        }
        else {
          util.showMsg(res.data.msg, '')
        }
      },
      fail: function () {
        util.showMsg('程序出错，请重试', '../record/record')
      }
    })
    // if (e.currentTarget.dataset.do == 0) {
    //   this.setData({
    //     sending: 1
    //   })
    //   countdown4micro(this)
    // } 
    // console.log(this.data.second)
    // if (this.data.second == 60 || this.data.second<=0){
    //   var that = this;
      
    // }
    
  },
  inputPwdConfirm:function(e){
    this.setData({
      pwd_confirm: e.detail.value
    })
  },
  inputPwd:function(e){
    this.setData({
      pwd: e.detail.value
    })
  },
  commitPhone:function(){
    var phone=this.data.phone;
    var token = wx.getStorageSync('token');
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
    if (phone[0] != '1'||phone.length != 11) 
    { 
        util.showMsg('请输入正确手机号', '');
        return
    } 
    if (this.data.code.length == 0) {
      util.showMsg('请输入验证码', '');
      return
    }
    if (this.data.pwd.length <= 5){
      util.showMsg('请输入正确登录密码')
      return
    }
    // if (this.data.pwd_confirm.length == 0) {
    //   util.showMsg('请输入确认密码')
    //   return
    // }
    // if (this.data.pwd_confirm != this.data.pwd) {
    //   util.showMsg('两次输入密码不一致')
    //   return
    // }
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/code-phone', 
            data:{
                phone:phone,
                token:token,
                active_id: that.data.active_id,
                code:that.data.code,
                pwd:that.data.pwd,
                newToken: that.data.newToken
            },
            method: 'POST',
            header: {
                'content-type': "application/x-www-form-urlencoded"
            },
            success: function(res) {
              console.log(res)
              if (res.data.code == 0){
                  wx.reLaunch({
                    url: '../index/index?store_id=' + that.data.store_id + '&active_id=' + that.data.active_id,
                  })
              
              } else if (res.data.code ==3) {
                wx.reLaunch({
                  url: '../haveDone/haveDone',
                })
              } else{
                util.showMsg(res.data.data, '')
              }
            },
            fail: function() {  
              util.showMsg('程序出错，请重试', '')
            }
          })
  },
  inputPhone: function(e) {
      this.setData({
        phone:e.detail.value
      })
},
  onLoad: function (options) {
    var that = this;
    
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height:res.screenHeight
        })
      },
    })
    util.WXLogin()
    // wx.navigateTo({
    //   url: '../index/index?store_id=14&active_id=2&phone=13366026441',
    // })

    //    wx.navigateTo({
    //      url: '../haveDone/haveDone?store_id=3&active_id=2&phone=13366026441',
    //  })
    var that = this;
    if ('store_id' in options) {
      that.setData({
        store_id: parseInt(options.store_id)
      })
    } else if ('active_id' in options) {
        that.setData({
          active_id: parseInt(options.active_id)
        })
    } else {
      that.setData({
        store_id: 14,
        active_id: 2
      })
    }
    wx.request({
      url: app.globalData.baseUrl + '/shangmi/api/v1/active-image',
      data: {
        token: wx.getStorageSync('token'),
        store_id: parseInt(that.data.store_id),
        active_id: parseInt(that.data.active_id),

      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        if (res.data.code == 0) {
          that.setData({
            image: res.data.data.icon,
            
          })
        } else {
          util.showMsgBack(res.data.data)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})
 