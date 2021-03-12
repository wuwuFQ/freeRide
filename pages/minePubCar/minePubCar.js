// pages/minePubCar/minePubCar.js
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
    that.getCarList();
    WXNotify.addNotification(WXNotify.wx_modifyCarInfo, that.modifyCarInfoNotify, that);
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
    WXNotify.removeNotification(WXNotify.wx_modifyCarInfo, that);

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.data.pageNo = 1;
    that.getCarList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.data.pageNo++;
    that.getCarList();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getCarList: function () {
    var that = this;
    wx.request({
      method: "GET",
      url: getApp().globalData.httpURL + '/release/getMyTripCarList',
      data: {
        "userId": app.globalData.userInfo.id,
        "currentPage": that.data.pageNo,
        "pageSize": 10
      },

      success: function (res) {
        console.log(res.data)
        let response = res.data;
        if (response.code == 10000) {
          let array = response.data.carList
          if (that.data.pageNo == 1) {
            wx.stopPullDownRefresh({
              success: (res) => {},
            })
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

  // 删除
  deleteHandle(event) {
    console.log(`点击标签 ${event.currentTarget.id}`);
    var that = this;
    var index = event.currentTarget.id;
    var model = that.data.dataArr[index];

    wx.showModal({
      title: '删除行程',
      content: '您确定要删除该行程吗?',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.httpURL + '/release/deleteCarInfo',
            method: 'POST',
            data: {
              userId: app.globalData.userInfo.id,
              id: model.id
            },
            success(res) {
              let response = res.data;
              if (response.code == 10000) {
                var arr = that.data.dataArr;
                arr.splice(index, 1);
                that.setData({
                  dataArr: arr,
                });
                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
              }
            }

          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
// 修改
  modifyHandle(event) {
    console.log(`点击标签 ${event.currentTarget.id}`);
    var model = this.data.dataArr[event.currentTarget.id];
    wx.navigateTo({
      url: '../publishCar/publishCar?model=' + JSON.stringify(model),
    })

  },

  // 修改了车辆信息 刷新页面
  modifyCarInfoNotify() {
    var that = this;
    that.data.pageNo = 1;
    that.getCarList();
  },

// 查看详情
  itemClickHandle: function (event) {
    console.log(`点击标签 ${event.currentTarget.id}`);
    var model = this.data.dataArr[event.currentTarget.id];
    wx.navigateTo({
      url: '../carDetail/carDetail?model=' + JSON.stringify(model),
    })
  },

})