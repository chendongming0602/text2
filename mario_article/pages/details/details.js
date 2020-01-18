// miniprogram/pages/details/details.js
const APP = getApp()
// const WxParse = require('../../utils/wxParse/wxParse.js');//组件解析（卡）
import { rich } from '../../../utils/rich.js';//解析富文本

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDistance: false,//音乐图标距离
    isMusic: true,//音乐播放
    isList: true,//数据加载完成
    list: {},
    listArr: [],//推荐列表
    adShow: APP.adShow,//广告位显示
    content: "",
    isGG:APP.isGG,
  },

  musicImg() {//背景音乐的按钮
    if (this._isMusic) return ;
    this.setData({
      isMusic: !this.data.isMusic
    }, () => {
      if (this.data.isMusic) {
        this.music.play();
      } else {
        this.music.pause();
      }
    })
  },
  detailList() {//数据
    return APP.get(
     "ArticleDetails",
           {
        id: this.id
      }
    ).then(res => {
      // console.log(res)
      let text = res.content;
      // WxParse.wxParse("textHtml", 'html', text, this);
      setTimeout(() => {//延时给富文本渲染
        this.setData({ isList: false })
      }, 500);
      let richText = rich(text);//解析完成后的
      this.setData({
        content: richText
      })
      let obj = {};//将不必要的地方去掉，减少data的压力
      for (var key in res) {
        if (key !== "content")
          obj[key] = res[key]
      };
      this.setData({
        list: obj
      });
      try {
        if (!!APP.userInfo.isPower) {
          // console.log(APP.userInfo)
          APP.aldstat.sendEvent('进入详情页面', {
            "用户名字": APP.userInfo.wxInfo.nickName,
            "用户头像": APP.userInfo.wxInfo.avatarUrl,
            "文章标题": obj.title,
            "文章ID": obj.id
          });
        } else {
          APP.aldstat.sendEvent('进入详情页面', {
            "用户名字": "用户未授权",
            "用户头像": "用户未授权",
            "文章标题": obj.title,
            "文章ID": obj.id
          });
        }
      } catch (err) {
        console.log("阿里丁记录文章标题失败", err)
      }
      return res
    });
  },
  recommend() {//推荐
    return APP.get(
      "ArticleDetails",
      {
        id: this.id
      }
    ).then(res => {
      this.setData({
        listArr: res
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.music = wx.createInnerAudioContext();//背景音乐
    this.music.autoplay = true;//自动播放
    this.music.loop = true;//循环播放
    // console.log(options)
    this.id = options.id;
    if (APP.isCallback) {
      this.allS();
    } else {
      APP.callbackEvent = res => {
        this.allS();
      };
    };
    // APP.loadShow()
  },
  allS(){
    Promise.all([this.detailList()])
      .then(res => {
        wx.hideLoading();
        try {
          if (!res[0].background_music) {
            // APP.hintShow("背景音乐播放失败！");
            this.setData({ isMusic: false });
            this._isMusic = true;
          }
          this.music.onError((e) => {
            // APP.hintShow("背景音乐播放失败！");
            this.setData({ isMusic: false });
            this._isMusic = true;
          });
          if (this._isMusic) return this.music.stop();
          this.music.src = res[0].background_music;
          this.music.title = "背景音乐"
        } catch (err) {
          console.log(err, 2222)
          // APP.hintShow("背景音乐播放失败！2");
          this.setData({ isMusic: false });
          this._isMusic = true
        }
        wx.hideLoading();
      }).catch(() => {
        APP.hintShow("数据加载失败！！")
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPageScroll: function (e) {//滚动触发
    if (e.scrollTop > 150) {
      this.setData({
        isDistance: true
      })
    } else {
      this.setData({
        isDistance: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isMusic){
      this.music.play();
    }
    
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
    this.music.stop();
    this.music.pause()
    this.music.destroy();
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
  onShareAppMessage: function (res) {
    let datas = this.data.list;
    // if (!res.target) {//正常分享
      return {
        title: datas.share_title ? datas.share_title:datas.title,
        imageUrl: datas.share_img ? datas.share_img:datas.cover,
        path: '/mario_article/pages/details/details?id=' + datas.id
      };
    // } 
  }
})