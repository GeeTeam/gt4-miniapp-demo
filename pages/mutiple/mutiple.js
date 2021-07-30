// miniprogram/pages/captcha.js

const ai = '2e3cdd87ca5b729409e38bc17173702c';
const  assign = 'be13c9e8983709233fd1ef8d70df68a0';
const mnutiple = '26e13e2fddb82988f10eee81be1a6342'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    captchaId: mnutiple,
    loadCaptcha: false,
    styleConfig:{
      btnWidth: '210px',
      btnHeight: '40px',
      color: 'red',
      bgColor: '#000'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  },
 captchaValidate: function () {
  var self = this
  var data = self.data.result


  if (!data) {
      console.log('请先完成验证！')
      return
  }
  wx.request({
      url: 'https://gt4.geetest.com/demov4/demo/login?t=' + new Date().getTime(),
      method: 'GET',
      dataType: 'json',
      data: Object.assign({},data, {
        captcha_id: self.data.captchaId
      }),
      success: function (res) {
        wx.showToast({
          title: res.data.result
      })
      },
      fail: function () {
          console.log('error')
      }
  })
},

captchaSuccess: function (result) {
  console.log('captcha-Success!')
  this.setData({
      result: result.detail
  })
},
captchaReady:function(){
    console.log('captcha-Ready!')
},

captchaClose:function(){
    console.log('captcha-Close!')
},

captchaError: function (e) {
  console.log('captcha-Error!', e.detail)
  // 这里对challenge9分钟过期的机制返回做一个监控，如果服务端返回code:21,tips:not proof，则重新调用api1重置
  if (e.detail.code === 21) {
      var self = this
      // 需要先将插件销毁
      self.setData({ loadCaptcha: false })
      // 重新调用api1
      self.captchaRegister()
  }
},
// btnSubmit: function(){
//   this.captchaValidate()
// },
btnReset:function(){
  const self = this;
  if(self.delay) {
    self.delay()
  }else {
    self.delay = self.debounce(
      ()=>{
        self.setData({
          toReset: new Date()
        })
      },1000,true);
      self.delay();
  }
},
// 防抖函数
debounce(func, delay, immediate) {
  let timer = null;
  return function () {
    let context = this;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      // 第一次立即调用
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);

      if (callNow) {
        func.apply(this, arguments);
      }
    } else {
      timer = setTimeout(() => {
          func.apply(this, arguments);
      }, delay);
    }
  };
},
btnSubmit: function () {
  this.captchaValidate();
}
})