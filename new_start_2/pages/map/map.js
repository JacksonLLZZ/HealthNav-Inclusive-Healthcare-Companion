Page({
    data: {
      // Queue
      queueAhead: 5,
      queueMinutes: 15,
      queuePercent: 100,
      queueTimer: null,
  
      // Reminders
      soundEnabled: false,
      flashEnabled: false,
      flashMode: 'off',
      titleScale: 100,
      bodyScale: 100,
  
      // ✨ 新增：控制相机组件是否挂载，防止多页面冲突
      isCameraReady: false, 
    },
  
    onLoad() {
      const cfg = getApp().getFontConfig();
      this.setData({ titleScale: cfg.titleScale, bodyScale: cfg.bodyScale });
      this.startQueueSimulation();
    },
  
    // ✨ 新增：每次进入这个 Tab 页面时，挂载相机组件
    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
              selected: 1
            });
          }
          
          // 注意：这里保留我们上一个问题里加的 isCameraReady 逻辑
          this.setData({
            isCameraReady: true
          });
        
        this.setData({
        isCameraReady: true
      });

    },
  
    // ✨ 新增：每次离开这个 Tab 页面时，彻底销毁相机组件并关闭闪光灯
    onHide() {
      this.setData({
        isCameraReady: false
      });
      this.cleanupFlash(); // 离开页面时顺手关掉闪光灯
    },
  
    onUnload() {
      this.cleanupFlash();
      // 页面卸载时也置为 false 双重保险
      this.setData({ isCameraReady: false }); 
      if (this.data.queueTimer) {
        clearInterval(this.data.queueTimer);
      }
    },
  
    /* ===== Queue Simulation ===== */
    startQueueSimulation() {
      const timer = setInterval(() => {
        let { queueAhead, queueMinutes } = this.data;
        if (queueAhead > 0) {
          queueAhead -= 1;
          queueMinutes = Math.max(0, queueMinutes - 3);
          const percent = queueAhead / 5 * 100;
          this.setData({
            queueAhead,
            queueMinutes,
            queuePercent: percent
          });
        }
        if (queueAhead === 0) {
          clearInterval(this.data.queueTimer);
          this.setData({ queueTimer: null, queueMinutes: 0, queuePercent: 0 });
          this.onTurnReady();
        }
      }, 5000);
      this.setData({ queueTimer: timer });
    },
  
    /* ===== Turn Ready — Trigger Reminders ===== */
    onTurnReady() {
      if (this.data.soundEnabled) {
        wx.vibrateLong();
        wx.vibrateShort();
      }
      if (this.data.flashEnabled) {
        this.triggerFlash();
      }
      if (!this.data.soundEnabled && !this.data.flashEnabled) {
        wx.showToast({ title: 'Your turn is ready!', icon: 'none' });
      }
    },
  
    /* ===== Real Flashlight (Camera Torch) ===== */
    triggerFlash() {
      // ✨ 增加一层保护：如果此时相机没挂载，就不执行
      if (!this.data.isCameraReady) return;
  
      // Turn on the rear flashlight via camera torch
      this.setData({ flashMode: 'torch' });
      wx.vibrateShort();
  
      // Flash for about 2 seconds, then turn off
      if (this._flashTimer) clearTimeout(this._flashTimer);
      this._flashTimer = setTimeout(() => {
        this.setData({ flashMode: 'off' });
        this._flashTimer = null;
      }, 2000);
    },
  
    /* ===== Flash Cleanup ===== */
    cleanupFlash() {
      this.setData({ flashMode: 'off' });
      if (this._flashTimer) {
        clearTimeout(this._flashTimer);
        this._flashTimer = null;
      }
    },
  
    /* ===== Reminder Toggles ===== */
    onSoundToggle(e) {
      this.setData({ soundEnabled: e.detail.value });
    },
  
    onFlashToggle(e) {
      this.setData({ flashEnabled: e.detail.value });
      if (!e.detail.value) {
        // Turn off flashlight immediately when user disables
        this.cleanupFlash();
      }
    },
  
    /* ===== Navigation — Open dedicated compass page ===== */
    onNavigate() {
      wx.navigateTo({
        url: '/pages/navigate/navigate'
      });
    },
  
    /* ===== AI Voice ===== */
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
// Page({

//   data: {
//     // Queue
//     queueAhead: 5,
//     queueMinutes: 15,
//     queuePercent: 100,
//     queueTimer: null,

//     // Reminders
//     soundEnabled: false,
//     flashEnabled: false,
//     flashMode: 'off',
//     titleScale: 100,
//     bodyScale: 100,

//     isCameraReady: false, // 控制相机是否挂载
//     flashMode: 'off',     // 你的手电筒状态
//   },

//   onLoad() {
//     const cfg = getApp().getFontConfig();
//     this.setData({ titleScale: cfg.titleScale, bodyScale: cfg.bodyScale });
//     this.startQueueSimulation();
//   },

//   onUnload() {
//     this.cleanupFlash();
//     if (this.data.queueTimer) {
//       clearInterval(this.data.queueTimer);
//     }
//   },

//   /* ===== Queue Simulation ===== */
//   startQueueSimulation() {
//     const timer = setInterval(() => {
//       let { queueAhead, queueMinutes } = this.data;
//       if (queueAhead > 0) {
//         queueAhead -= 1;
//         queueMinutes = Math.max(0, queueMinutes - 3);
//         const percent = queueAhead / 5 * 100;
//         this.setData({
//           queueAhead,
//           queueMinutes,
//           queuePercent: percent
//         });
//       }
//       if (queueAhead === 0) {
//         clearInterval(this.data.queueTimer);
//         this.setData({ queueTimer: null, queueMinutes: 0, queuePercent: 0 });
//         this.onTurnReady();
//       }
//     }, 5000);
//     this.setData({ queueTimer: timer });
//   },

//   /* ===== Turn Ready — Trigger Reminders ===== */
//   onTurnReady() {
//     if (this.data.soundEnabled) {
//       wx.vibrateLong();
//       wx.vibrateShort();
//     }
//     if (this.data.flashEnabled) {
//       this.triggerFlash();
//     }
//     if (!this.data.soundEnabled && !this.data.flashEnabled) {
//       wx.showToast({ title: 'Your turn is ready!', icon: 'none' });
//     }
//   },

//   /* ===== Real Flashlight (Camera Torch) ===== */
//   triggerFlash() {
//     // Turn on the rear flashlight via camera torch
//     this.setData({ flashMode: 'torch' });
//     wx.vibrateShort();

//     // Flash for about 2 seconds, then turn off
//     if (this._flashTimer) clearTimeout(this._flashTimer);
//     this._flashTimer = setTimeout(() => {
//       this.setData({ flashMode: 'off' });
//       this._flashTimer = null;
//     }, 2000);
//   },

//   /* ===== Flash Cleanup ===== */
//   cleanupFlash() {
//     this.setData({ flashMode: 'off' });
//     if (this._flashTimer) {
//       clearTimeout(this._flashTimer);
//       this._flashTimer = null;
//     }
//   },

//   /* ===== Reminder Toggles ===== */
//   onSoundToggle(e) {
//     this.setData({ soundEnabled: e.detail.value });
//   },

//   onFlashToggle(e) {
//     this.setData({ flashEnabled: e.detail.value });
//     if (!e.detail.value) {
//       // Turn off flashlight immediately when user disables
//       this.cleanupFlash();
//     }
//   },

//   /* ===== Navigation — Open dedicated compass page ===== */
//   onNavigate() {
//     wx.navigateTo({
//       url: '/pages/navigate/navigate'
//     });
//   },

//   /* ===== AI Voice ===== */
//   startRecording() {
//     wx.vibrateShort();
//     wx.showToast({
//       title: 'Listening...',
//       icon: 'loading',
//       duration: 10000
//     });
//   },

//   stopRecording() {
//     wx.hideToast();
//     wx.showToast({
//       title: 'AI Processing...',
//       icon: 'none',
//       duration: 1500
//     });
//   }
// });
