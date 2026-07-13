App({
  onLaunch() {
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },

  getFontConfig() {
    return { titleScale: 115, bodyScale: 110 };
  },

  globalData: {
    userInfo: null,
    selectedTab: 0
  }
});
