//app.js
import util from 'we7/resource/js/util.js';

function request(action, method, data) {//封装的请求
  if (!data) {
    data = {};
  }
  if (!data.m) {
    data.m = 'mario_article';
  }

  return new Promise((resolve, reject) => {
    util.request({
      'url': 'entry/wxapp/' + action,
      'data': data,
      success: function (res) {
        // console.log(res);
        if (res.data.code == "success") {
          resolve(res.data.data);
        }
        reject(res.data.message);
      },
      fail: function (res) {
        reject(((res.data && res.data.message) ? res.data.message : res.errMsg));
      },
      complete: function () {
      }
    });
  });
}

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onError: function (msg) {
    console.log(msg)
  },
  util: util,
  globalData: {
    userInfo: null,
  },
  siteInfo: require('siteinfo.js'),
  loadShow(text = "加载中...") {
    wx.showLoading({
      title: text,
      icon: "none"
    });
  },
  hintShow(text = "有个提示~") {
    wx.showToast({
      title: text,
      icon: "none",
      duration: 2000
    })
  },
  get(action, param){
    return request(action, 'GET', param)
  }, 
  post(action, param){
    return request(action, 'POST', param)
  }, 

});