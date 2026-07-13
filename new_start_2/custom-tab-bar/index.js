Component({
  data: {
    selected: 0,
    color: '#999999',
    selectedColor: '#1A7A5C',
    list: [
      {
        pagePath: '/pages/booking/booking',
        text: 'Booking',
        iconPath: '/images/tab/booking.png',
        selectedIconPath: '/images/tab/booking_hl.png'
      },
      {
        pagePath: '/pages/map/map',
        text: 'Clinic',
        iconPath: '/images/tab/clinic.png',
        selectedIconPath: '/images/tab/clinic_hl.png'
      },
      {
        pagePath: '/pages/profile/profile',
        text: 'Profile',
        iconPath: '/images/tab/profile.png',
        selectedIconPath: '/images/tab/profile_hl.png'
      }
    ]
  },

  lifetimes: {
    attached() {
      // Restore selected tab from global state
      this.restoreFromGlobal();
    }
  },

  pageLifetimes: {
    show() {
      // Prioritize global data — getCurrentPages() may return stale route during tab transitions
      this.restoreFromGlobal();
    }
  },

  methods: {
    // Try global data first, then fall back to route matching
    restoreFromGlobal() {
      try {
        const app = getApp();
        if (app && app.globalData && app.globalData.selectedTab !== undefined) {
          this.setData({ selected: app.globalData.selectedTab });
          return;
        }
      } catch (e) {
        // getApp() might fail if called too early
      }
      this.syncFromRoute();
    },

    // Match selected tab by current page route
    syncFromRoute() {
      try {
        const pages = getCurrentPages();
        if (pages.length) {
          const currentPath = '/' + pages[pages.length - 1].route;
          const idx = this.data.list.findIndex(item => item.pagePath === currentPath);
          if (idx !== -1) {
            this.setData({ selected: idx });
            // Persist to global state for next component instantiation
            try {
              const app = getApp();
              if (app && app.globalData) {
                app.globalData.selectedTab = idx;
              }
            } catch (e) {}
            return;
          }
        }
      } catch (e) {}
      // Fallback: keep current selected
    },

    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.list[index];
      if (!item) return;

      // Persist to global state immediately (survives component recreation)
      try {
        const app = getApp();
        if (app && app.globalData) {
          app.globalData.selectedTab = index;
        }
      } catch (e) {}

      // Update UI immediately for instant visual feedback
      this.setData({ selected: index });

      // Navigate to the target page
      wx.switchTab({ url: item.pagePath });
    }
  }
});
