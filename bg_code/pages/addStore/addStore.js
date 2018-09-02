// pages/addStore/addStore.js
var app = getApp()
var util = require('../../utils/util.js')
var bool_map = {true: 1, false: 0}

function uploadDIY(filePaths, successUp, failUp, i, length, store_id) {
    if (filePaths.length == 0) {
      
        if (wx.canIUse('showToast')) {
            wx.showToast({
                title: '上传成功',
            })
        }
        setTimeout(function () {
            wx.navigateBack({
                delta: 1
            })
        }, 1500);
        return;
    }
    wx.uploadFile({
        url: app.globalData.baseUrl + '/v2/stores/' + store_id+ '/images',
        filePath: filePaths[i],
        name: 'image',
        formData: {
            'token': wx.getStorageSync('token'),
        },
        success: (resp) => {
            if (wx.canIUse('showLoading')) {
                wx.hideLoading()
            }
            successUp++;
            if (successUp == length) {
              util.showMsgBack('上传成功')
            }
            var json_data = JSON.parse(resp.data);
            if (json_data.code == 0) {

            }
        },
        fail: (res) => {
            if (wx.canIUse('showLoading')) {
                wx.hideLoading()
            }
            failUp++;
        },
        complete: () => {

            i++;
            console.log(i == length)
            if (i == length) {
                if (wx.canIUse('showLoading')) {
                    wx.hideLoading()
                }
                if (wx.canIUse('showToast')) {
                    wx.showToast({
                        title: '上传成功',
                    })
                }
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1500);
                return;
            }
            else {  //递归调用uploadDIY函数
                uploadDIY(filePaths, successUp, failUp, i, length, store_id);
            }
        },
    });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:['商业超市', '普通便利店', '连锁便利店', '夫妻老婆店', '其他'],
    type_id:'',
    store_type:'门店类型',
    store_name:'',
    store_lots: ['商业区', '写字楼', '社区', '学校', '医院', '车站', '其他'],
    lot_id:0,
    store_id:'',
    store_lot:'商业区',
    mating_types: ['打印机', '数据库', '无法对接'],
    mating_type: '打印机',
    mating_id:0,
    start_time:'00:00',
    end_time:'23:59',
    have_fresh_cooked_food: true,
    store_area: '',
    store_address:'点此选择地址',
    lat: 0,
    lng: 0,
    manager_name:'',
    manager_phone:'',
    is_update:true,
    is_select:false,
    detail_address:'',
    selects_tmp:[],
    selects: [{ 'image': '../../../images/options/add.png',  'id': '' }],
    dock_ids:[],
    commit_images: [],
    images: ['../../images/addImage.jpg']
  },
  deleteImage: function(e){
      var index = parseInt(e.currentTarget.dataset.m_index);
      var images = this.data.images;
      var commit_images = this.data.commit_images
      var new_images = util.del(images, index)
      this.setData({
          images: new_images,
          commit_images: new_images.slice(0,(new_images.length - 1))
      }) 
  },
  selectImage: function (e) {
      var index = parseInt(e.currentTarget.dataset.imageid);
      var commit_images = this.data.commit_images;
      var images = this.data.images
      if ((index + 1) == this.data.images.length) {
          var that = this;
          wx.chooseImage({
              count: 9, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                  var tempFilePaths = res.tempFilePaths
                  var tmps = commit_images.concat(tempFilePaths);
                  that.setData({
                      commit_images: tmps
                  })
                  tmps.push('../../images/addImage.jpg')
                  that.setData({
                      images: tmps
                  })
              }
          })
      } else {
          var image = this.data.images[index]
          wx.previewImage({
              current: image, // 当前显示图片的http链接
              urls: this.data.images // 需要预览的图片http链接列表
          })
      }
  },
  
  
  inputDetailAddress: function(e){
    this.setData({
        detail_address: e.detail.value
    })
  },
  inputManagerName: function(e){
    this.setData({
      manager_name: e.detail.value
    })
  },
  inputManagerTel: function(e) {
    this.setData({
      manager_phone: e.detail.value
    })
  },
  inputArea: function(e) {
    this.setData({
      store_area: e.detail.value
    })
  },
  inputAddress: function(e){
    var that = this
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          store_address: res.address,
          lat: latitude,
          lng: longitude,
        })
      }
    })
      
  },
  switchChange: function (e) {
    this.setData({
      have_fresh_cooked_food: e.detail.value
    })
  },
  bindPickerChange:function(e){
    var index = parseInt(e.detail.value)
    var name = this.data.types[index]
    this.setData({
      type_id: e.detail.value,
      store_type: name 
    })
  },
  bindStartTimeChange: function(e){
    this.setData({
      start_time: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      end_time: e.detail.value
    })
  },
  bindMatingChange: function(e){
    var index = parseInt(e.detail.value)
    var name = this.data.mating_types[index]
    console.log('sada', e)
    this.setData({
      mating_id: e.detail.value,
      mating_type: name
    })
  },
  bindStoreLotChange: function(e){
    var index = parseInt(e.detail.value)
    var name = this.data.store_lots[index]
    this.setData({
      lot_id: e.detail.value,
      store_lot: name
    })
  },
  inputName:function(e){
    this.setData({
      store_name: e.detail.value
    })
  },
  commit:function(){
    var that = this;
    
    if (that.data.store_name.length == 0 || that.data.manager_phone.length == 0 || that.data.store_address.length == 0){
      wx.showModal({
        title: '提示',
        content: '请完善信息',
      })
      return;
    }
    if (wx.canIUse('showLoading')) {
      wx.showLoading({
        title: '上传中……',
      })
    }
    
    
    var data = {
        token: wx.getStorageSync('token'),
        lat: that.data.lat,
        lng: that.data.lng,
        store_name: that.data.store_name,
        store_address: that.data.store_address,
        phone: that.data.manager_phone,
        boss_name: that.data.manager_name
    }
    
    var url = app.globalData.baseUrl + '/shangmi/api/v1/stores'
    wx.request({
        url: url,
        data: data,
        method: 'POST',
        header: {
            'content-type': "application/x-www-form-urlencoded"
        },
      success: function (res) {
          console.log(res)
        if (res.data.code == 0) {
          util.showMsgBack('新增成功')
        } else {
          util.showMsgBack('服务器挂掉了')
        }
      },
      fail: function () {
        util.showMsgBack('程序出错，请重试')
      },
      complete:function(){
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
    var that = this;
    
    if (options.store_id){
      this.setData({
          is_update: true,
          store_id: options.store_id
      })
      
    } else {
      this.setData({
        is_update: false
      })
     
     return;
    }
      wx.showLoading({
        title: '加载中……',
      })
      var that = this;
      wx.request({
        url: app.globalData.baseUrl + '/v2/stores/' + options.store_id,
        data: {
          token: wx.getStorageSync('token'),
          result_type: 'store'
        },
        method: 'GET',
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 0) {
            var store_msg = res.data.data;
           
            if (store_msg.images && store_msg.images.length > 0) {
                var imgs = store_msg.images
                
                that.setData({
                    commit_images: imgs,
                })
                imgs.push('../../images/addImage.jpg')
                that.setData({
                    images: imgs
                })
            }
            
            if (store_msg.cmid && store_msg.cmid.length>0){
                var cimds = store_msg.cmid
                var tmp = []
                for (var i = 0; i < cimds.length;i++){
                    if (i != cimds.length - 1) {
                        tmp.push({ 'image': '../../../images/options/delete.png', 'id': cimds[i]})
                    } else {
                        tmp.push({ 'image': '../../../images/options/add.png', 'id': cimds[i] }) 
                    }
                }
                that.setData({
                    dock_ids:tmp,
                    selects: tmp
                })
            }
            that.setData({
              store_name: store_msg.store_name,
              store_address: store_msg.store_address,
              start_time: store_msg.business_hours?store_msg.business_hours.split('-')[0]:'00:00',
              end_time: store_msg.business_hours?store_msg.business_hours.split('-')[1]:'23:59',
              have_fresh_cooked_food: store_msg.have_fresh_cooked_food?true:false,
              manager_phone: store_msg.telephone,
              type_id:store_msg.store_type,
              store_type: that.data.types[store_msg.store_type],
              mating_id: store_msg.docking_mode,
              detail_address: store_msg.house_number,
              manager_name: store_msg.store_owner ? store_msg.store_owner:'',
              mating_type: that.data.mating_types[store_msg.docking_mode],
              store_area: store_msg.store_area ? store_msg.store_area:0,
              lot_id: store_msg.store_location ? store_msg.store_location:0,
              store_lot: store_msg.store_location ? that.data.store_lots[store_msg.store_location] : that.data.store_lots[0]
            })
          }
        },
        fail: function () {
          util.showMsg('程序出错，请重试', '../index/index')
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
    if (this.data.is_update == false) {
      return ;
    }else{
      // if(this.data.is_select==false){
      //   var that = this
      //   wx.chooseLocation({
      //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      //     success: function (res) {
      //       var latitude = res.latitude
      //       var longitude = res.longitude
      //       that.setData({
      //         store_address: res.address,
      //         lat: latitude,
      //         lng: longitude,
      //         is_select: true
      //       })
      //       // console.log(that.data.is_select)
      //     }
      //   })
      // }
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      is_select: true
    })
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