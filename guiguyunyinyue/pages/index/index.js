
import request from '../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],     // 轮播图数据
    recommendList:[],   // 推荐歌曲
    topList:[]         // 排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 轮播图数据
    let bannerDataList = await request('/banner',{type:2})
    this.setData({
      bannerList:bannerDataList.banners
    })
    // 推荐歌曲
    let recommendDataList = await request('/personalized',{limit:10})
    this.setData({
      recommendList:recommendDataList.result
    })
    // 排行榜
    let index = 0;
    let resultArr = [];
    while(index <= 5){
      let topListData = await request('/top/list',{idx: index++});
      // splice(会修改原数组) slice(不修改原数组)
      let topListItem = {name:topListData.playlist.name, tracks:topListData.playlist.tracks.slice(0,3)};
      resultArr.push(topListItem);
      // 不需要等渲染完才加载，用户体验好
      this.setData({
        topList:resultArr
      })
    }
  },

  // 跳转至recommentSong页面
  toRecommentSong(){
    wx.navigateTo({
      url: '/pages/recommentSong/recommentSong',
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