// app.js
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch() {


    //同步获取用户信息
    var info = wx.getStorageSync('userInfo');
    if (!this.isNull(info)) {
      this.globalData.userInfo = info;
    } else {
      // 登录
      wx.login({
        success: res => {
          console.log(res);
          // 发送 res.code 到后台换取 openId（otvsv5ai27v_Wu3r55-vA1KJE0lU）, sessionKey, unionId
          this.getWeChatOpenID(res.code);
        }
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.weChatInfo = res.userInfo
              //更新数据库...
              this.updateUserInfo();
            }
          })
        }
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  globalData: {
    // 用户模型
    userInfo: null,
    // 用户的微信信息
    weChatInfo: null,
    httpURL: 'https://localhost',   //测试
    // httpURL: 'https://wuwufq.asia',   //正式

  },
  // 获取openID
  getWeChatOpenID: function (code) {
    var that = this;
    wx.request({
      url: that.globalData.httpURL + '/wechat/getOpenID',
      data: {
        code: code
      },
      success: res => {
        let response = res.data;
        if (response.code == 10000) {
          let openid = response.data.openid;
          //登录和注册
          that.loginAndRegister(openid);
        }
      }
    })
  },

  //登录和注册
  loginAndRegister: function (openid) {
    var that = this; 
    wx.request({
      url: that.globalData.httpURL + '/user/loginUpdateData',
      method: "POST",
      data: {
        wechatOpenid: openid
      },
      success: res => {
        console.log("登录成功");
        that.globalData.userInfo = res.data.data
        wx.setStorage({
          data: that.globalData.userInfo,
          key: 'userInfo',
        })
      }
    })
  },
  //更新用户信息
  updateUserInfo: function () {
    var that = this;
    if (that.isNull(that.globalData.userInfo)) {
      return;
    }
    if (that.isNull(that.globalData.weChatInfo)) {
      return;
    }
 
    var info = that.globalData.userInfo;
    var weChat = that.globalData.weChatInfo;
    wx.request({
      url: getApp().globalData.httpURL + '/user/loginUpdateData',
      method: "POST",
      data: {
        "id": info.id,
        "wechatOpenid": info.wechatOpenid,

        "wechatNickName": weChat.nickName,
        "wechatAvatarurl": weChat.nickName,
        "wechatGender": weChat.gender,
        "wechatCountry": weChat.country,
        "wechatProvince": weChat.province,
        "wechatCity": weChat.city,
        "wechatAvatarurl": weChat.avatarUrl
        
      },
      success: res => {
        console.log("更新用户信息成功");
        that.globalData.userInfo = res.data.data
        wx.setStorage({
          data: that.globalData.userInfo,
          key: 'userInfo',
        })
      }
    })
  },

  //加载用户信息
  loadUserInfo: function (userId) {
    var that = this;
    wx.request({
      url: getApp().globalData.httpURL + '/user/getUserInfo',
      method: "POST",
      data: {
        id: userId
      },
      success: res => {
        that.globalData.userInfo = res.data.data
      }
    })
  },



// obj是空值?
  isNull: function (obj) {
    if (obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  }
  
})
