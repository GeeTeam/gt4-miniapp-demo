## 极验小程序插件接入指南

---
#### 搜索申请：
1. 首先在小程序管理后台的"设置-第三方服务-插件管理"中添加插件，通过AppID查找所需的插件，等待极验通过申请。

2. 在项目app.json文件中声明所需要使用的插件 （最低可使用版本为1.0.0，为使体验最佳，请及时更新到最高版本）
```
{
 "plugins": {
    "captcha4": {
      "version": "1.0.0",
      "provider": "wxxxxxxxxxxxxx"
    }
  },
}
```

3. 在页面配置文件中(.json)使用我们的captcha4插件
```
{
  "usingComponents": {
    "captcha4": "plugin://captcha4/captcha4"
  }
}
```

4. 页面wxml中插入captcha4
```
<captcha4 id="captcha" wx:if="{{loadCaptcha}}" captchaId="{{captchaId}}"  bindonSuccess="captchaSuccess"
 />
```

5. onLoad时期在页面初始化插件，this.setData中为必传参数
 ```
 
 onLoad: function() {
    this.setData({ loadCaptcha:true,captchaId:"wxxxxxxxxxxxx"})
  }
  ```

6. 使用极验提供的onSuccess获取验证结果，准备二次验证
```
captchaSuccess:function(result){
  console.log("captcha-Success!");
    this.setData({
        result: result.detail
    })
  }
```

7. 二次验证
```
captchaValidate: function(){
    var self = this;
    var data = self.data.result; // 获取完成验证码时存储的验证结果
    if(typeof data !== "object"){
      console.log("请先完成验证！")
      return 
    }
    // 将结果提交给用户服务端进行二次验证
    wx.request({
      url: "API2接口（详见服务端部署）",
      method: "POST",
      dataType: "json",
      data: Object.assign({},data, {
        captcha_id: self.data.captchaId
      }),
      success: function (res) {
        wx.showToast({
          title: res.data.result
        })
      },
      fail: function () {
        console.log("error")
      }
    })
  }
```

####  提供的api接口  
  * Ready 监听验证按钮的 DOM 生成完毕事件，用户可点击
  * Success 监听验证成功事件，参数为验证结果（用于二次验证）
  * Error 监听验证出错事件
  * Close 插件关闭时
  * language 多语言国际化，支持的语言为示例提供的几种
  * styleConfig 自定义组件样式
  * product 定义产品形式，默认为popup，可选bind。支持版本1.2.0及以上
  * toReset 用户主动调用，对二次验证的情况去重置验证码
  * verify 适用于bind模式，唤起验证码

### toReset
```
// 调用toReset接口需要在模版中多加一个属性
<captcha4  id="captcha"  captchaId="{{captchaId}}" bindReady="captchaReady" bindError="captchaError" product="bind"  bindSuccess="captchaSuccess"  riskType="{{riskType}}" toReset="{{toReset}}" />
  // 方法调用
    btnReset:function(){
      this.setData({
        toReset: true
      })
    }
```

####  提供自定义样式
  * 在调用的组件上传入styleConfig 
  * styleConfig 中可选参数 color 只能传入完整6位的HEX，点选按钮上的背景色为传入的色值透明度的60%；
  * styleConfig 中可选参数 btnWidth 传入合法的css长度，需要带单位。
  * styleConfig 中可选参数 btnHeight 传入合法的css长度，需要带单位。

  ``` 
  // wxml
  <captcha4 styleConfig="{{styleConfig}}"/>
  // js
  data:{
    styleConfig: {
      color: "#00aa90",  // 必须是完整的6位
      btnWidth: "260px"  // minwidth: 210px, maxwidth:320px
      btnHeight: "40px"  
	  }
  }
  ```
### 多语言国际化支持
 使用方式为在组件传参，不传默认为中文
 ```
   // wxml
  <captcha4 language="zh"/>	
 ```
 * zh默认  中文
 * en 英文
  
### bind模式使用
首先组件中传参,核心为bind、verify，其它参数此处省略，具体细节可参考bind模式demo
 ```
   // wxml
  <captcha4 product="bind" verify="{{verify}}"/>	
 ```
然后在需要时调用toVerify方法
 ```
    btnSubmit: function () {
        // 进行业务逻辑处理
        console.log("用户名效验完毕，打开验证码");

        // 唤起验证码
        this.toVerify();
    },
    toVerify: function () {
   	// 如果采用现代框架，可能会因为diff导致设置失效，可以将true换成随机数 Date.now()
        this.setData({
            verify: true
        })
    },
 ```

#### Tips&Bug
  * toReset 由于小程序的限制，实际无法直接去调用插件内部组件的方法，这里是hack的方式，通过改变组件的公有属性(properties)，触发observer调用内部方法
  * captcha4插件的父容器大小会影响插件的显示，请参照demo设置一个合适的大小
  * 为了防止challenge9分钟过期无法reset，需要在error中对code：21，tips：not proof做一个监控，以便重置插件


#### 帮助

| 问题 | 参考解答| 
| :------ | :----- |
| 小程序插件支持web的无按钮bind模式吗？| ~~不支持，由于微信小程序插件对于安全方面的限制，致使外部无法调用插件内方法。~~ 支持，最新版本1.2.0已经提供支持|
| 验证码支持哪几种验证形式？如何使用？ | word、icon、phrase、slide、nine。极验后台申请相应id即可|
| 插件放置时间过长或者出错了怎么办？ |  在Error做监听，reset验证插件 |
| 服务端接口如何部署与使用？ | 参考pc端的部署方式，详细见官网文档https://docs.geetest.com/install/deploy/server/csharp|




