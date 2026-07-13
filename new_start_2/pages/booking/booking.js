Page({

  data: {
    showSharePanel: false,
    showQRCode: false,
    qrCodeSrc: '/images/booking/qr_placeholder.png',
    shareContext: '',
    sharePanelTitle: 'Send to family member',
    titleScale: 100,
    bodyScale: 100
  },

  onShow() {
    // 获取当前页面的 custom-tab-bar 实例并强制高亮第 0 个
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
  },
  
  onLoad() {
    const cfg = getApp().getFontConfig();
    this.setData({ titleScale: cfg.titleScale, bodyScale: cfg.bodyScale });
    this.fetchQRCode();
  },

  // 调用 Google Chart API 生成签到二维码
  fetchQRCode(callback) {
    const data = 'https://www.qrcode-monkey.com';
    const url = 'https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=' + encodeURIComponent(data) + '&choe=UTF-8';
    wx.downloadFile({
      url: url,
      success: (res) => {
        this.setData({ qrCodeSrc: res.tempFilePath });
        if (callback) callback();
      },
      fail: () => {
        console.warn('QR API fallback to placeholder');
        if (callback) callback();
      }
    });
  },

  // 预约签到 — 显示二维码
  onCheckIn() {
    this.setData({ showQRCode: true });
  },

  hideQRCode() {
    this.setData({ showQRCode: false });
  },

  // 快速预约 — 跳转预约详情页
  onQuickBooking() {
    wx.navigateTo({
      url: '/pages/book-detail/book-detail'
    });
  },

  // 家庭预约 — 弹出转发面板
  onFamilyBooking() {
    this.setData({
      showSharePanel: true,
      shareContext: 'family',
      sharePanelTitle: 'Send booking link to family'
    });
  },

  // 医疗卡 — 跳转建档页
  onBindMedicalCard() {
    wx.navigateTo({
      url: '/pages/medical/medical'
    });
  },

  // 医疗卡分享
  onMedShare() {
    this.setData({
      showSharePanel: true,
      shareContext: 'medical',
      sharePanelTitle: 'Share medical card link'
    });
  },

  hideSharePanel() {
    this.setData({ showSharePanel: false });
  },

  // 分享给指定成员
  onShareTo(e) {
    const name = e.currentTarget.dataset.name;
    const ctx = this.data.shareContext;
    const msg = ctx === 'medical'
      ? 'Medical card link sent to ' + name
      : 'Booking link sent to ' + name;
    this.setData({ showSharePanel: false });
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2500
    });
  },

  // 快捷提问胶囊
  onQuickAsk(e) {
    const text = e.currentTarget.dataset.text || '';
    wx.showToast({
      title: 'Ask: ' + text,
      icon: 'none',
      duration: 2000
    });
  },

  // 进入咨询页
  onStartConsultation() {
    wx.navigateTo({
      url: '/pages/consult/consult'
    });
  }
});
