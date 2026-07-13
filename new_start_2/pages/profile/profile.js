const app = getApp();

Page({

  data: {
    account: '',
    password: ''
  },

  /* ===== Account Input ===== */
  onAccountInput(e) {
    this.setData({ account: e.detail.value });
  },

  onShow() {
    // 强制高亮第 2 个 (Profile)
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
  },
  
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onLogin() {
    const { account, password } = this.data;
    if (!account || !password) {
      wx.showToast({
        title: 'Please fill in all fields',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.showLoading({ title: 'Signing in...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: 'Login successful!',
        icon: 'success',
        duration: 2000
      });
    }, 1500);
  },

  onWechatLogin() {
    wx.showLoading({ title: 'WeChat Login...' });
    wx.login({
      success: (res) => {
        wx.hideLoading();
        if (res.code) {
          wx.showToast({
            title: 'WeChat Login successful!',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: 'Login failed, please try again',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: 'Login failed, please try again',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  onRegister() {
    wx.showToast({
      title: 'Register - coming soon',
      icon: 'none',
      duration: 2000
    });
  }
});
