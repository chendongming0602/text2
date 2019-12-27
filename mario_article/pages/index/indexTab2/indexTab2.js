// pages/index/indexTab1/indexTab1.js
// import http from '../../../util/request.js';
const APP = getApp();
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
    list: [],
    isEmptyList: true,//加载为空了
    newList: [],
    adShow: APP.adShow
  },
  attached() {
    this.more = false;//是否是上拉加载
    this.page = 1
    APP.loadShow()
    Promise.all([this.moreList()])
      .then(() => {
        wx.hideLoading()
      }).catch(err => {
        wx.hideLoading();
        APP.hintShow("加载数据失败！！")
      })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    moreList() {//更多
      let data = this.data
      return APP.get(
        "ArticleTopList",
        {
          page: this.page,
        }
      ).then(res => {
        console.log(res)
        if (res.lists.length === 0) {
          this.setData({ isEmptyList: false })
        }
        this.setData({
          list: this.more ? data.list.concat(res.lists) : res.lists
        });
      });
    },
    // newList() {//热门
    //   return APP.get(
    //     "ArticleList",
    //     {
    //       page: this.page,
    //       type: "hot"
    //     }
    //   ).then(res => {
    //     this.setData({
    //       newList: res
    //     });
    //   })
    // },
    onPullDown(e) {//下拉刷新
      APP.loadShow()
      const { stop } = e.detail;
      this.setData({
        isEmptyList: true,
      });
      this.more = false;
      this.page = 1;
      Promise.all([this.moreList()])
      .then(() => {
        wx.hideLoading();
        stop();
      }).catch(err => {
        stop();
        APP.hintShow("刷新失败！！")
      });
    },
    onReachBottom(e) {
      const { stop } = e.detail;
      if (!this.data.isEmptyList) return stop();
      APP.loadShow();
      this.more = true;
      this.page += 1
      this.moreList().then(() => {
        stop();
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading();
        stop();
        APP.hintShow("上拉加载失败！")
      })
    }
  }
})
