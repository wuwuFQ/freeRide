// pages/pepole/pepole.js
const app = getApp();
const WXNotify = require('../../utils/WxNotificationCenter.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr: [],
    pageNo: 1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getPeopleList();
    WXNotify.addNotification(WXNotify.wx_modifyPeopleInfo, that.modifyPeopleInfoNotify, that);
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
    var that = this;
    WXNotify.removeNotification(WXNotify.wx_modifyPeopleInfo, that);

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.data.pageNo = 1;
    that.getPeopleList();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.data.pageNo++;
    that.getPeopleList();

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getPeopleList: function () {
    var that = this;
    wx.request({
      method: "GET",
      url: app.globalData.httpURL + '/release/getReleaseTripPeople',
      data: {
        "currentPage": that.data.pageNo,
        "pageSize": 10
      },

      success: function (res) {
        console.log(res.data)
        let response = res.data;
        if (response.code == 10000) {
          let array = response.data.peopleList
          if (that.data.pageNo == 1) {
            wx.stopPullDownRefresh();
            that.setData({
              dataArr: array
            })
          } else {
            if (array.length == 0) {
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none',
              })
            } else {
              that.setData({
                dataArr: that.data.dataArr.concat(array)
              })
            }
          }
        }
      }
    })
  },
  
  itemClickHandle: function (event) {
    console.log(`点击标签 ${event.currentTarget.id}`);
    var model = this.data.dataArr[event.currentTarget.id];
    wx.navigateTo({
      url: '../pepoleDetail/pepoleDetail?model=' + JSON.stringify(model),
    })

  },

  // 修改了人员信息 刷新页面
  modifyPeopleInfoNotify() {
    var that = this;
    that.data.pageNo = 1;
    that.getPeopleList();

  },

})