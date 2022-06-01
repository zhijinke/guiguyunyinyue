// pages/search/search.js
import request from '../utils/request'
let isSend = false; //函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'', //placeholder的数据
    hotMusic:[],  //热搜音乐
    searchContent:'', //输入的数据
    searchList:[], //搜索返回的数据
    historyList:[], //初始化历史数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlaceholderData()
    // 调用本地历史记录
    this.getHistoryListData()
  },

// 获取本地历史记录的功能函数
getHistoryListData(){
  let historyList = wx.getStorageSync('searchHistory')
  if(historyList){
    this.setData({
      historyList
    })
  }
},

// 获取placeholder数据的函数
async getPlaceholderData(){
  let placeholderData = await request('/search/default')
  let hotMusicData = await request('/search/hot/detail')
  this.setData({
    placeholderContent:placeholderData.data.showKeyword,
    hotMusic:hotMusicData.data
  })
},

// 表单项内容发生改变的回调
handelInputChange(event){
  this.setData({
    searchContent:event.detail.value.trim()
  })
  if(isSend){
    return
  }
  isSend = true;
  // 调用搜索数据函数
  this.getSearchList()
  // 函数节流
  setTimeout(()=>{
    isSend = false
  },500)
},

// 获取搜索数据的功能函数
async getSearchList(){
  if(!this.data.searchContent){
    this.setData({
      searchList:[],
    })
    return;
  }
  let {searchContent,historyList} = this.data
  // 发请求获取关键字模糊匹配数据
  let searchListData =await request('/search',{keywords:searchContent,limit:10})
  this.setData({
    searchList:searchListData.result.songs
  })
  // 将搜索的关键字添加到搜索历史记录中
  if(historyList.indexOf(searchContent) !== -1){
    historyList.splice(historyList.indexOf(searchContent),1)
  }
  historyList.unshift(searchContent)
  this.setData({
    historyList
  })
  wx.setStorageSync('searchHistory', historyList)
},

// 删除搜索内容
clearSearchContent(){
  this.setData({
    searchContent:'',
    searchList:[]
  })
},
// 删除历史记录
deleteSearchHistory(){
  wx.showModal({
    content:'确定删除吗？',
    success:(res)=>{
      if(res.confirm==true){
          // 清空历史搜索数组
      this.setData({
        historyList:[],
      })
      // 清空本地存储的历史搜索记录
      wx.removeStorageSync('searchHistory')
      }
    }
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