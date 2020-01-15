// components/login/login.js
const APP = getApp();
import util from '../../we7/resource/js/util.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo(e) {
      if (e.detail.rawData) {//同意授权
        wx.showLoading({
          title: '授权中...',
          mask: true
        })
        util.getUserInfo(()=>{
          wx.hideLoading();
          APP.userInfoE();
          this.triggerEvent("loginEvent");
        });
      } else {
        wx.hideLoading();
        console.log("拒绝授权");
      }
    },
  }
})
