// components/list/list.js
const APP=getApp();
import {ads} from "../../utils/ads.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name:String,
    isEmpty:{//是否显示为空
      type:Boolean,
      value:false
    },
    list:Array,//数据
    isEmptyList:{//数据为空
      type:Boolean,
      value:true
    },
    listClass:{//最新还是热门
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ads,
    isGG:APP.isGG
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e){
      let { id } = e.currentTarget.dataset
      console.log(id)
      wx.showLoading({
        title: '努力加载中...',
        mask:true
      })
      wx.navigateTo({
        url: '/pages/details/details?id='+id,
      });
    },
  }
})
