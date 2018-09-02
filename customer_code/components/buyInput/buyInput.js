// components/cmInputToast/cmInputToast.js
var util = require('../myUtils/util.js')

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    num: {
      type: Number,
      value: 1
    },
    
    price: {
      type: Number
    },
    sum:{
      type: Number,
      value: 1
    }
  },
  data: {
    after: '',
    before: '',
    abled: false
  },
  methods: {
    // 这里是一个自定义方法
    inputBefore: function (e) {
      this.setData({
        before: e.detail.value
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
    add: function (e) {
      var price = this.data.price
      var num = this.data.num
      this.setData({
        num: num + 1
      })
      this.setData({
        sum: price * (num + 1)
      })
      
    },
    reduce: function (e) {
      var price = this.data.price
      var num = this.data.num
      if (num <= 1){
        return
      }
      this.setData({
        num: num - 1
      })
      this.setData({
        sum: price * (num - 1)
      })

    },
    cancel: function (e) {
      this.triggerEvent('cancel', e.detail)
    },
    confirm: function (e) {
      
      this.triggerEvent('confirm', { 'sum': this.data.sum, 'num': this.data.num })
    },
  }
})