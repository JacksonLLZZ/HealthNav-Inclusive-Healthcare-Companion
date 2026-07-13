Page({

  data: {
    idFront: '',
    idBack: '',
    name: '',
    idNumber: '',
    phone: '',
    titleScale: 100,
    bodyScale: 100
  },

  onLoad() {
    const cfg = getApp().getFontConfig();
    this.setData({ titleScale: cfg.titleScale, bodyScale: cfg.bodyScale });
  },

  uploadIDFront() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ idFront: res.tempFiles[0].tempFilePath });
      }
    });
  },

  uploadIDBack() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ idBack: res.tempFiles[0].tempFilePath });
      }
    });
  },

  onFaceAuth() {
    wx.showToast({
      title: 'Opening camera...',
      icon: 'none',
      duration: 1000
    });
    // In production: wx.startFacialRecognitionVerify({...})
    // Demo: simulate auth after a moment
    setTimeout(() => {
      wx.showToast({
        title: 'Authentication successful',
        icon: 'success',
        duration: 2000
      });
    }, 1500);
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onIdInput(e) {
    this.setData({ idNumber: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onSubmit() {
    const { name, idNumber, phone } = this.data;
    if (!name || !idNumber || !phone) {
      wx.showToast({
        title: 'Please fill in all fields',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.showToast({
      title: 'Registration submitted',
      icon: 'success',
      duration: 2000
    });
  }
});
