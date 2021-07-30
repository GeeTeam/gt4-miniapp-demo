// miniprogram/pages/captcha.js

const ai = '2e3cdd87ca5b729409e38bc17173702c';
const  assign = '83ee748676c09d077c5c83e3b8a08e32';
const mnutiple = '61bb227961cd66292589dabd70cd7a5f'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    captchaId: assign,
    riskType: 'word',
    loadCaptcha: false,
    styleConfig:{
      btnWidth: '240px'
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
  console.log(result);
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
},
// btnSubmit: function(){
//   this.captchaValidate()
// },
btnReset:function(){
  this.setData({
      toReset: new Date()
  })
},
btnSubmit: function () {
  this.captchaValidate();
}
})