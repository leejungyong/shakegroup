const app=getApp()
Page({


  data: {
    hideWanba:false,
    session_key: wx.getStorageSync('session_key') ? wx.getStorageSync('session_key'):null
  },

  // closeWanba(){
  //   this.setData({
  //     hideWanba:true
  //   })
  // },
  checkNum(num){
    let data={
      num:num,
      openid:wx.getStorageSync('openid')
    }
    wx.request({
      url: app.globalData.config.apiUrl + 'tmall.php?act=checkNum',
      data: data,
      method: 'POST',
      success(res) {
        console.log(res)
        let data=res.data
        if(data.status){
         wx.setStorageSync('userText',data.msg)
         wx.navigateTo({
           url: './shake',
         })
        }else{
           wx.showModal({
             title: '提示',
             content: data.msg,
             showCancel:false,
             success:(res)=>{
                
             }
           })
        }
},
      fail(err) {
        console.log(err)
      }
    })
  },
  getPhoneNumber: function (e) {
    //  console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
    // console.log(wx.getStorageSync('session_key'))
    let that = this
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      const encryptedData = e.detail.encryptedData
      let data = {
        iv: e.detail.iv,
        encryptedData: encryptedData,
        session_key: wx.getStorageSync('session_key')
      }
      wx.request({
        url: app.globalData.config.apiUrl + 'decrypt/decrypt-xuehuiwan.php',
        data: data,
        method: 'POST',
        success(res) {
          console.log(wx.getStorageSync('session_key'))
          console.log(res)
          let data = JSON.parse(res.data)
          // console.log(data)
          if (data.phoneNumber) {
            let num = data.phoneNumber
            console.log(num)
            that.checkNum(num)
          }

        },
        fail(err) {
          console.log(err)
        }
      })

    } else {
      wx.showModal({
        title: '',
        showCancel: false,
        content: '需要获取您的手机号码方可继续'
      })

    }
  },
  onLoad: function (options) {
    console.log(wx.getStorageSync('session_key'))
    if (wx.getStorageSync('session_key')&&wx.getStorageSync('state')==1){
      wx.navigateTo({
        url: './shake',
      })
    }else{
      wx.setStorageSync('state', 0)
    }
  },


})