// pages/mine/mine.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    actions: [
      {
        name: '我有车找老乡',
      },
      {
        name: '我需要用车',
      },
    ],

    appVersion: "1.0.0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const accountInfo = wx.getAccountInfoSync();
    console.log(accountInfo.miniProgram.appId) // 小程序 appId
    console.log(accountInfo.miniProgram.envVersion) // 小程序 appId
    console.log(accountInfo.miniProgram.version) // 小程序 appId


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

  // 点击头像
  headImgClickHandle: function () {
    wx.showToast({
      title: '这个头像真帅！',
      icon: 'none'
    })
  },

  pushBtnHandle: function (event) {
    console.log(event.detail.userInfo);

    if (event.detail.userInfo != null) {
      if (app.isNull(app.globalData.weChatInfo)) {
        getApp().globalData.weChatInfo = event.detail.userInfo;
        getApp().updateUserInfo();
      }
      this.setData({ show: true });
    }

  },
  onCancelSheet: function () {
    this.setData({ show: false });

  },

  //  选择发布的类型
  onSelectSheet: function (event) {
    console.log(event.detail);
    var name = event.detail.name;
    if (name == "我需要用车") {
      wx.navigateTo({
        url: '../publishPepole/publishPepole',
      })

    } else {
      wx.navigateTo({
        url: '../publishCar/publishCar',
      })
    }
    this.setData({ show: false });

  },
  /**
   * 我的发布
  */
  minePublishClickHandle() {
    wx.navigateTo({
      url: '../minePublish/minePublish',
    })
  },
  // 关于我们
  aboutUSClickHandle() {
    wx.navigateTo({
      url: '../aboutUS/aboutUS',
    })
  }

})