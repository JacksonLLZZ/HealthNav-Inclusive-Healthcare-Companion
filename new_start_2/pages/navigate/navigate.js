Page({

  data: {
    targetBearing: 90,
    rotateAngle: 0,
    directionText: 'WAIT...',
    headerBgColor: '#003366',
    titleScale: 100,
    bodyScale: 100
  },

  onLoad() {
    const cfg = getApp().getFontConfig();
    this.setData({ titleScale: cfg.titleScale, bodyScale: cfg.bodyScale });
    this.startCompassListener();
  },

  onUnload() {
    wx.stopCompass();
  },

  startCompassListener() {
    const that = this;
    wx.startCompass({
      interval: 'normal',
      success: () => {
        wx.onCompassChange((res) => {
          const currentHeading = res.direction;
          const relativeAngle = (that.data.targetBearing - currentHeading + 360) % 360;

          let text = '';
          let bgColor = '';

          if (relativeAngle <= 35 || relativeAngle >= 325) {
            text = 'GO STRAIGHT';
            bgColor = '#00A86B';
          } else if (relativeAngle > 35 && relativeAngle < 155) {
            text = 'TURN RIGHT';
            bgColor = '#FF6600';
          } else if (relativeAngle >= 155 && relativeAngle <= 205) {
            text = 'TURN AROUND';
            bgColor = '#D32F2F';
          } else {
            text = 'TURN LEFT';
            bgColor = '#FF6600';
          }

          that.setData({
            rotateAngle: relativeAngle,
            directionText: text,
            headerBgColor: bgColor
          });
        });
      },
      fail: () => {
        wx.showToast({ title: 'Compass failed', icon: 'none' });
      }
    });
  },

  startRecording() {
    wx.vibrateShort();
    wx.showToast({
      title: 'Listening...',
      icon: 'loading',
      duration: 10000
    });
  },

  stopRecording() {
    wx.hideToast();
    wx.showToast({
      title: 'AI Processing...',
      icon: 'none',
      duration: 1500
    });
  }
});
