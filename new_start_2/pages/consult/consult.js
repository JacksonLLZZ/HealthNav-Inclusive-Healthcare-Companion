Page({

  data: {
    inputText: '',
    messages: [
      { type: 'ai', text: "Hello! I'm your AI health assistant. Please describe your symptoms, and I'll help you find the right clinic. You can also upload images (X-ray, photos, etc.) for me to analyze." },
    ],
    images: []
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  // 选取图片
  onPickImage() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const files = res.tempFiles.map(f => f.tempFilePath);
        this.setData({
          images: [...this.data.images, ...files]
        });
        // 模拟 AI 回应
        this.addAIMessage("I've received your image. Let me analyze it... (AI analysis feature coming soon)");
      },
      fail: () => {
        wx.showToast({ title: 'Image selection cancelled', icon: 'none' });
      }
    });
  },

  // 发送消息
  onSend() {
    const text = this.data.inputText.trim();
    if (!text) {
      this.pickOrSend();
      return;
    }

    // 添加用户消息
    const msgs = this.data.messages;
    msgs.push({ type: 'user', text: text });
    this.setData({
      messages: msgs,
      inputText: ''
    });

    // 模拟 AI 回复
    setTimeout(() => {
      this.addAIMessage("Thank you for sharing. Based on your description, I recommend consulting the **Internal Medicine** department. Would you like me to help you book an appointment?");
    }, 1000);
  },

  // 点击发送按钮但无文字时触发图片上传
  pickOrSend() {
    if (this.data.images.length > 0) {
      this.addAIMessage("Thank you for the images. I'm analyzing them. (AI image analysis coming soon)");
    }
  },

  addAIMessage(text) {
    const msgs = this.data.messages;
    msgs.push({ type: 'ai', text: text });
    this.setData({ messages: msgs });
  }
});
