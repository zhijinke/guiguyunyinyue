// pages/video/video.js
import request from '../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[], //导航标签数据
    navId:'', //导航的标识
    videoList:[],//视频内容
    videoId:'', //视频标识id
    videoUpdateTime:[], //记录video播放的时长
    isTriggered:false,  //标识下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据
    this.getVideoGroupListData();
  },
// 获取导航数据
async getVideoGroupListData(){
  let videoGroupListData =await request('/video/group/list');
  this.setData({
    videoGroupList:videoGroupListData.data.slice(0,14),
    navId:videoGroupListData.data[0].id
  })

  // 获取视频列表数据
  this.getVideoList(this.data.navId)
},

// 获取视频列表数据
async getVideoList(navId){
  if(!navId){ //判断navId为空的情况
    return
  }
  let videoListData = await request('/video/group',{id:navId})
  // 关闭提示框
  wx.hideLoading()
  let index = 0
  let videoList = videoListData.datas.map(item=>{
    item.id = index++;
    return item;
  })
  this.setData({
    videoList,
    isTriggered:false  //关闭下拉刷新
  })
},
// 点击切换导航的回调
changeNav(e){
let navId = e.currentTarget.id; 
this.setData({
  navId:navId *1,
  videoList:[]
})
// 显示正在加载
wx.showLoading({
  title:'正在加载'
})
  // 动态获取视频列表数据
  this.getVideoList(this.data.navId)
},

// 解决多个视频一起播放的bug
handlePlay(event){
  let vid = event.currentTarget.id;
  // 关闭上一个播放的视频
  if(this.vid !== vid){
    if(this.videoContext){
      this.videoContext.stop()
    }
  }
  this.vid = vid;

  // 更新data中videoId的状态
  this.setData({
    videoId:vid
  })
  // 创建控制video标签的实例对象
  this.videoContext = wx.createVideoContext(vid)

  // 判断当前的视频之前是否播放过，如果有跳转至播放位置
  let {videoUpdateTime} = this.data
  let videoItem = videoUpdateTime.find(item => item.vid === vid)
  if(videoItem){
    this.videoContext.seek(videoItem.currentTime)
  }
},

// 监听视频播放进度的回调
handleTimeUpdate(event){
  let videoTimeOjb = {vid:event.currentTarget.id,currentTime:event.detail.currentTime}
  let {videoUpdateTime} = this.data
  let videoItem = videoUpdateTime.find(item => item.vid === videoTimeOjb.vid)
  if(videoItem){ //之前有
    videoItem.currentTime = event.detail.currentTime
  }else{  //之前没有
    videoUpdateTime.push(videoTimeOjb)
  }
  // 更新videoUpdateTime的状态
  this.setData({
    videoUpdateTime
  })
},

// 视频播放结束调用的回调
handleEnend(event){
  // 移出记录播放时长当前视频的对象
  let {videoUpdateTime} = this.data
  videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id),1)
  this.setData({
    videoUpdateTime
  })
},

// 下拉刷新的回调
handleRefresher(){
  // 再次发请求，获取最新的数据
  this.getVideoList(this.data.navId)
},

// 上拉加载
handleTolower(){
  // 模拟数据
  console.log("发送请求 || 在前端截取最新数据追加到后面")
},

// 跳转到search页面
toSearch(){
  wx.navigateTo({
    url: '/pages/search/search',
  })
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

  }
})