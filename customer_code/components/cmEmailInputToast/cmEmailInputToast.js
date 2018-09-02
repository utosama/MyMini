// components/cmInputToast/cmInputToast.js
var util = require('../myUtils/util.js')

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title: {
      type: String,
      value: 'title设置显示内容'
    },
    iconUrl: {
      type: String,
      value: '',
    },
    confirmText: {
      type: String,
      value: 'confirmText属性值'
    }
  },
  data: {
    after:'',
    before: '',
    abled: false
  },
  methods: {
    // 这里是一个自定义方法
    inputBefore: function (e) {
      this.setData({
        before: e.detail.value
      })
      if (this.data.after.length == 0 || this.data.before.length == 0){
        this.setData({
          abled: false
        })
      } else {
        this.setData({
          abled: true
        })
      }
    },
    inputAfter: function (e) {
      this.setData({
        after: e.detail.value
      })
      if (this.data.after.length == 0 || this.data.before.length == 0) {
        this.setData({
          abled: false
        })
      } else {
        this.setData({
          abled: true
        })
      }
    },
    cancel: function (e) {
      this.triggerEvent('cancel', e.detail)
    },
    confirm: function (e) {
      if (this.data.abled == false) {
        return
      }
      this.triggerEvent('confirm', { 'after': this.data.after, 'before': this.data.before})
    },
  }
})