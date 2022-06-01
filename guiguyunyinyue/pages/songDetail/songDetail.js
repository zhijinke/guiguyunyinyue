// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import request from '../utils/request'
import moment from 'moment'
// 获取全局实例
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false, //音乐是否播放（遥杆的状态）
    song:{}, //歌曲详情
    musicId:'', //音乐id
    musicLink:'',  //音乐的链接
    durationTime:'00:00', //总时长
    currentTime:'00:00', //实时播放时长
    progressbar:'0', //进度条
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.musicId);
    let musicId = options.musicId
    this.setData({
      musicId
    })
    // 调用歌曲详情的函数
    this.getMusicInfo(musicId)

    // 判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId===musicId){
      // 修改当前音乐的播放状态
      this.setData({
        isPlay:true
      })
    }

      // 创建控制音乐播放器的实例
      this.backgroundAudioManager = wx.getBackgroundAudioManager();
      // 监视音乐播放、暂停、停止
      this.backgroundAudioManager.onPlay(()=>{
        this.changePlayState(true)
        // 修改全局音乐的播放状态
        appInstance.globalData.musicId=musicId
      })
      this.backgroundAudioManager.onPause(()=>{
        this.changePlayState(false)
      })
      this.backgroundAudioManager.onStop(()=>{
        this.changePlayState(false)
      })

      // 监听音乐自然播放结束
      this.backgroundAudioManager.onEnded(()=>{
        // 自动切换下一首音乐，并自动播放
        PubSub.publish('switchType','next')
        // 将进度条进度设置为0
        this.setData({
          progressbar:0,
          currentTime:'00:00',
        })
      })

      // 监听音乐实时播放的进度
      this.backgroundAudioManager.onTimeUpdate(()=>{
        // 格式化实时的播放时间
        let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
        let progressbar = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
        this.setData({
          currentTime,
          progressbar
        })
      })
  },

  // 修改播放状态的功能函数
  changePlayState(isPlay){
    // 修改音乐的状态
    this.setData({
      isPlay
    })

    // 修改全局音乐的播放状态
    appInstance.globalData.isMusicPlay=isPlay
  },
// 获取歌曲详情的回调
async getMusicInfo(musicId){
  let songData = await request('/song/detail',{ids:musicId})
  // songData.songs[0].dt 单位ms
  let durationTime = moment(songData.songs[0].dt).format('mm:ss');
  // 更新data的状态
  this.setData({
    song:songData.songs[0],
    durationTime
  })
  // 动态更新窗口标题
  wx.setNavigationBarTitle({
    title: this.data.song.name
  })
},
// 点击播放(暂停)的回调
handleMusicPlay(){
  let isPlay = !this.data.isPlay;
  this.setData({
    isPlay
  })

  // 调用
  let {musicId,musicLink} = this.data
  this.musicControl(isPlay,musicId,musicLink)
},

// 控制音乐播放暂停的功能函数
async musicControl(isPlay,musicId,musicLink){

  if(isPlay){
    if(!musicLink){
      // 获取音乐播放链接
    let musicLinkData = await request('/song/url',{id:musicId})
    musicLink = musicLinkData.data[0].url
    this.setData({
      musicLink
    })
    }

    this.backgroundAudioManager.src = musicLink
    this.backgroundAudioManager.title = this.data.song.name
  }else{
    this.backgroundAudioManager.pause()
  }
},

// 上一首、下一首歌的回调
handelMusic(event){
  let type = event.currentTarget.id;
      // 暂停上一首歌
      this.backgroundAudioManager.stop()
    // 订阅来自recommentSong页面的消息
    PubSub.subscribe('musicId',(msg,musicId)=>{
      // 获取歌曲详情
      this.getMusicInfo(musicId)
      // 自动播放
      this.musicControl(true,musicId)
      // 取消订阅
      PubSub.unsubscribe('musicId')
    })
  // 发布消息数据给recommentSong页面
  PubSub.publish('switchType',type);
},  

  /*
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