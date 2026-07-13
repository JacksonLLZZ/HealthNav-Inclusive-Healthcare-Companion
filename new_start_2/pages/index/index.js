Page({
    data: {
      soundEnabled: true,
      flashEnabled: false,
      queueCount: 5,
      waitTime: 15,
      flashMode: 'off',   // 控制闪光灯状态
      cameraAuthorized: false  // 标记摄像头权限
    },
  
    onLoad() {
      this.startCountdown();
      // 预授权摄像头（不强制，若已授权则标记）
      this.checkCameraAuth();
    },
  
    onUnload() {
      if (this.timer) clearInterval(this.timer);
      if (this.flashTimer) clearTimeout(this.flashTimer);
    },
  
    // 检查摄像头权限
    checkCameraAuth() {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.camera']) {
            this.setData({ cameraAuthorized: true });
          }
        }
      });
    },
  
    // 启动倒计时（演示：每3秒减1人，等待时间减3分钟）
    startCountdown() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.data.queueCount > 0) {
          let newCount = this.data.queueCount - 1;
          let newWait = this.data.waitTime - 3;
          if (newWait < 0) newWait = 0;
          this.setData({
            queueCount: newCount,
            waitTime: newWait
          });
          if (newCount <= 0) {
            clearInterval(this.timer);
            this.triggerReminder();
          }
        }
      }, 3000);
    },
  
    // 触发提醒
    triggerReminder() {
      if (this.data.soundEnabled) {
        wx.vibrateLong({ fail: () => {} });
        wx.showToast({
          title: 'It\'s your turn!',
          icon: 'none',
          duration: 3000
        });
      }
      if (this.data.flashEnabled) {
        this.flashWithTorch();
      }
    },
  
    // 使用闪光灯闪烁
    flashWithTorch() {
      // 若已授权，直接闪烁；否则先请求授权
      if (this.data.cameraAuthorized) {
        this.startFlashSequence();
      } else {
        wx.authorize({
          scope: 'scope.camera',
          success: () => {
            this.setData({ cameraAuthorized: true });
            this.startFlashSequence();
          },
          fail: () => {
            // 拒绝授权，降级为长震动
            wx.vibrateLong({ type: 'heavy' });
            wx.showToast({
              title: 'Camera permission needed for flashlight',
              icon: 'none',
              duration: 2000
            });
          }
        });
      }
    },
  
    // 执行闪光序列：亮-暗-亮-暗-亮-暗（共3次）
    startFlashSequence() {
      const cycles = 8;          // 闪烁3次
      const onDuration = 400;    // 亮灯时长(ms)
      const offDuration = 300;   // 熄灯时长(ms)
      let count = 0;
  
      const toggle = () => {
        if (count >= cycles * 2) {
          // 结束，确保关闭
          this.setData({ flashMode: 'off' });
          return;
        }
        const isOn = count % 2 === 0;
        this.setData({ flashMode: isOn ? 'torch' : 'off' });
        const delay = isOn ? onDuration : offDuration;
        count++;
        this.flashTimer = setTimeout(toggle, delay);
      };
      toggle();
    },
  
    // 摄像头组件加载错误（极少出现）
    onCameraError() {
      wx.vibrateLong({ type: 'heavy' });
    },
  
    // 保留原有方法
    toggleSound(e) {
      this.setData({ soundEnabled: e.detail.value });
      wx.showToast({
        title: e.detail.value ? 'Sound On' : 'Sound Off',
        icon: 'none'
      });
    },
  
    toggleFlash(e) {
      this.setData({ flashEnabled: e.detail.value });
      wx.showToast({
        title: e.detail.value ? 'Flash On' : 'Flash Off',
        icon: 'none'
      });
    },
  
    startNavigation() {
      wx.navigateTo({
        url: '/pages/map/map'
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
        title: 'Processing AI...',
        icon: 'none'
      });
    }
  });