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
    value:'',
    abled: false
  },
  methods: {
    // 这里是一个自定义方法
    inputWord: function(e){
      this.setData({
        value: e.detail.value
      })
      var abled = false
      if (this.data.value.length>0){
        abled = true
      }
      this.setData({
        abled: abled
      })
    },
    cancel: function(e) {
      this.triggerEvent('cancel', e.detail)
    },
    confirm: function (e) {
      if (this.data.abled == false) {
        return
      }
      this.triggerEvent('confirm', { 'name': this.data.value})
    },
  }
})