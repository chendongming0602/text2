// components/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabCount:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[
      {
        name:"最新",
        url:"	https://minis-resources-1252149780.cos.ap-guangzhou.myqcloud.com/text2/tab/new.png",
        urlNo:"	https://minis-resources-1252149780.cos.ap-guangzhou.myqcloud.com/text2/tab/newNo.png"
      },
      {
        name:"热门",
        url:"	https://minis-resources-1252149780.cos.ap-guangzhou.myqcloud.com/text2/tab/fire.png",
        urlNo:"	https://minis-resources-1252149780.cos.ap-guangzhou.myqcloud.com/text2/tab/fireNo.png"
      }
    ],
    count:1
  },
  attached(){
    this.setData({
      count: this.data.tabCount
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tabEvent(e){
      let { index } = e.currentTarget.dataset
      this.setData({
        count:index
      },()=>{
        this.triggerEvent("tabIdex",index)
      })
    }
  }
})
