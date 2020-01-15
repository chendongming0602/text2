//app.js
import util from 'we7/resource/js/util.js';
// var siteInfo = require('siteinfo.js');
const ald = require('./utils/ald-stat.js');
const config = require('./siteinfo.js');
function request(action, method, data) {//封装的请求
  if (!data) {
    data = {
      version: config.version,
    };
  }else{
    data={
      version: config.version,
      ...data
    }
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
  isCallback:false,
  isGG:false,
  userInfo:{
    isPower:false
  },
  checkings:{//审核
    is_check:false
  },
  // siteInfo,
  onLaunch: function () {
    Promise.all([this.call(), this.getUserPic()]).then(res=>{
      this.isCallback=true
      if(this.callbackEvent){
        this.callbackEvent();
      }
    }).catch(err=>{
      if (this.callbackEvent) {
        this.callbackEvent();
      }
    })
    //调用API从本地缓存中获取数据
  },
  call(){
    return this.get("GetSetting").then(res=>{
       this.checkings={...res};
    });
  },
  getUserPic() {//授权请求
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            util.getUserInfo(() => {
              this.userInfoE();
              resolve()
            });
          } else {
            console.log("app: " + "用户暂时未授权")
            resolve()
          };
         
        }
      });
    })

  },
  userInfoE(){
    let userInfo = wx.getStorageSync('userInfo');
    this.userInfo = {
      ...userInfo,
      isPower: true
    };
    try {
      wx.aldstat.sendOpenid(userInfo.openid);
    } catch (err) {
      console.log("阿拉丁记录用户错误", err)
    }
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