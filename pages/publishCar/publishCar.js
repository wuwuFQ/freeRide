// pages/publishCar/publishCar.js
const utils = require('../../utils/util.js');
const app = getApp();
const WXNotify = require('../../utils/WxNotificationCenter.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region_start: ['', '', ''],
    region_end: ['', '', ''],

    minDate: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',

    carBrand: '',
    carType: '',
    numPeople: '',
    price: '',
    mobile: '',
    remarks: '',
// 是修改吗
    isModify: false,
    model: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (utils.isNull(options.model)) {
      this.setData({
        minDate: utils.formatDate(new Date()),
        startDate: utils.formatDate(new Date()),
        startTime: utils.formatTime(new Date()),
        isModify: false,
      });
    } else {
      var model = JSON.parse(options.model);
      if (utils.isNull(model)) {
        this.setData({
          minDate: utils.formatDate(new Date()),
          startDate: utils.formatDate(new Date()),
          startTime: utils.formatTime(new Date()),
          isModify: false,
        });
  
      } else {
        
      this.setData({
        model: model,
        region_start: [model.startProvince, model.startCity, model.startArea],
        region_end: [model.endProvince, model.endCity, model.endArea],

        minDate: utils.formatDate(new Date()),
        startDate: utils.formatDate(new Date(model.firstTime)),
        startTime: utils.formatTime(new Date(model.firstTime)),
        endDate: utils.formatDate(new Date(model.lastTime)),
        endTime: utils.formatTime(new Date(model.lastTime)),

        carBrand: model.carBrand,
        carType: model.carType,
        numPeople: model.numPeople,
        price: model.price,
        mobile: model.phone,
        remarks: model.remarks,

        isModify: true,
      });
    }
    }
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
  // 始发地
  bindStartRegionChange: function (e) {
    this.setData({
      region_start: e.detail.value
    })
  },
  // 目的地
  bindEndRegionChange: function (e) {
    this.setData({
      region_end: e.detail.value
    })
  },
  // 最早日期
  clickStartDateHandle(event) {
    this.setData({
      startDate: event.detail.value
    });
  },
  // 最早时间
  clickStartTimeHandle(event) {
    this.setData({
      startTime: event.detail.value
    });
  },
  // 最晚日期
  clickEndDateHandle(event) {
    this.setData({
      endDate: event.detail.value
    });
  },
  // 最晚时间
  clickEndTimeHandle(event) {
    this.setData({
      endTime: event.detail.value
    });
  },

  // 品牌
  carBrandInputChange(event) {
    this.data.carBrand = event.detail;
  },
  // 类别
  carTypeInputChange(event) {
    this.data.carType = event.detail;
  },
  // 多少人
  numberPepoleInputChange(event) {
    this.data.numPeople = event.detail;
  },
  // 多少钱
  howMuchIputChange(event) {
    this.data.price = event.detail;
  },
  // 手机号
  mobileInputChange(event) {
    this.data.mobile = event.detail;

  },
  // 备注
  remarkIputChange(event) {
    console.log(event.detail);
    this.data.remarks = event.detail;
  },
  // 发布
  pushBtnHandle() {

    if (utils.isNull(this.data.region_start[0])) {
      wx.showToast({
        title: '请选择出发的地址',
        icon: 'none'
      })
      return;
    }
    if (utils.isNull(this.data.region_end[0])) {
      wx.showToast({
        title: '请选择到达的地址',
        icon: 'none'
      })
      return;
    }
    if (utils.isNull(this.data.startDate)) {
      wx.showToast({
        title: '请选择最早出发日期',
        icon: 'none'
      })
      return;
    }
    if (utils.isNull(this.data.startTime)) {
      wx.showToast({
        title: '请选择最早出发时间',
        icon: 'none'
      })
      return;
    }
    if (utils.isNull(this.data.endDate)) {
      wx.showToast({
        title: '请选择最晚出发日期',
        icon: 'none'
      })
      return;
    }
    if (utils.isNull(this.data.endTime)) {
      wx.showToast({
        title: '请选择最晚出发时间',
        icon: 'none'
      })
      return;
    }
    if (utils.isNull(this.data.mobile)) {
      wx.showToast({
        title: '请输入您的手机号',
        icon: 'none'
      })
      return;
    }
    if (this.data.mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none'
      })
      return;
    }


    var that = this;
    var firstTime = utils.dateTimeStringToTimeStamp(that.data.startDate + ' ' + that.data.startTime);
    var lastTime = utils.dateTimeStringToTimeStamp(that.data.endDate + ' ' + that.data.endTime);

    if (that.data.isModify) {
      // 修改行程
      wx.request({
        url: app.globalData.httpURL + '/release/updateTripCarInfo',
        method: "POST",
        data: {
          "id": that.data.model.id,
          "userId": app.globalData.userInfo.id,
          "startProvince": that.data.region_start[0],
          "startCity": that.data.region_start[1],
          "startArea": that.data.region_start[2],
          "endProvince": that.data.region_end[0],
          "endCity": that.data.region_end[1],
          "endArea": that.data.region_end[2],
          "firstTime": firstTime,
          "lastTime": lastTime,
          "numPeople": that.data.numPeople,
          "carBrand": that.data.carBrand,
          "carType": that.data.carType,
          "price": that.data.price,
          "phone": that.data.mobile,
          "remarks": that.data.remarks,
        },
        success: res => {
          var response = res.data;
          if (response.code == 10000) {
            WXNotify.postNotificationName(WXNotify.wx_modifyCarInfo);
            wx.showToast({
              title: '行程修改成功',
              icon: 'success',
              duration: 1500,
              success: () => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1,
                  })
                }, 1500);
              }
            })
  
          }
        }
      })
  
    } else {
      // 发布行程
    wx.request({
      url: app.globalData.httpURL + '/release/saveTripCarInfo',
      method: "POST",
      data: {
        "userId": app.globalData.userInfo.id,
        "startProvince": that.data.region_start[0],
        "startCity": that.data.region_start[1],
        "startArea": that.data.region_start[2],
        "endProvince": that.data.region_end[0],
        "endCity": that.data.region_end[1],
        "endArea": that.data.region_end[2],
        "firstTime": firstTime,
        "lastTime": lastTime,
        "numPeople": that.data.numPeople,
        "carBrand": that.data.carBrand,
        "carType": that.data.carType,
        "price": that.data.price,
        "phone": that.data.mobile,
        "remarks": that.data.remarks,
      },
      success: res => {
        var response = res.data;
        if (response.code == 10000) {
          wx.showToast({
            title: '行程发布成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1500);
            }
          })

        }
      }
    })
  }
  }

})