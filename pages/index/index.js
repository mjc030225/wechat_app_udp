var common = require("../../utils/common_client.js") //消息处理命令
// index.js
// 获取应用实例
const app = getApp()
var ip = "39.96.125.85";
var port = 8899;
var udp;
var inputValue = "";
var RValue = "";
var radioValue = "E9";
var funcValue = "02";
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    inputValueTemp: "",
    showMeaningPanel: false,
    meaningText: '',
    messages: [],
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false    
  },
  inputData: function (e) {
    inputValue = e.detail.value;
    console.log(inputValue);
    this.setData({
      inputValueTemp: inputValue
    })
  },
  showMeaning() {
    var inputCode = funcValue;  // 获取输入并去除空格转为大写
    console.log(inputCode);
    const meaningMap = {
      "02": "用于写入地址高低位数据操作。",
      "B0": "用于执行查询操作。"
    };
    if (meaningMap[inputCode]) {
      this.setData({
        meaningText: meaningMap[inputCode],
        showMeaningPanel: true
      });
    } else {
      wx.showToast({
        title: '无效的操作码，请重新输入',
        icon: 'none'
      });
    }
  },
  ReceiveData: function (e) {
    RValue = e.detail.value;
    this.setData({
      receiveValue: RValue
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    udp = wx.createUDPSocket();
    udp.bind();     
    udp.onMessage(this.ReceiveData);
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  inputOver: function () {
    this.send_udp();
  },
  head_selection(e){
    console.log(e.detail.value);
    radioValue = e.detail.value;
    this.setData(
      {
        radioValue: e.detail.value
      }
    )
  },
  func_selection(e){
    console.log(e.detail.value);
    funcValue = e.detail.value;
    this.setData(
      {
        funcValue: e.detail.value
      }
    )

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  //发送消息
  send_udp: function () {
    if (inputValue == "") {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var head = radioValue;
    if (head == "E9"){
    inputValue = "E9" + funcValue + inputValue + "9E";}
    else{
      inputValue = "A9" + inputValue + "9A";
    }
    console.log(inputValue);
    udp.send({
      address: ip,
      port: port,
     message: common.procMessage(inputValue)
    });    
    
       inputValue = "";
        this.setData({
          inputValueTemp: inputValue,        
        });
     
  },

  //接收消息
  ReceiveData: function (res) {         
      //字符串转换，很重要          
 let unit8Arr = new Uint8Array(res.message);       
 RValue = String.fromCharCode.apply(null, unit8Arr);  
 
 this.setData({
  receiveValue: RValue
});   
  //RValue = decodeURIComponent(escape((encodedString))); //Utf8ArrayToStr.Utf8ArrayToStr(new Uint8Array(res.message.data));//decodeURIComponent(escape((encodedString)));    

  },
  
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
