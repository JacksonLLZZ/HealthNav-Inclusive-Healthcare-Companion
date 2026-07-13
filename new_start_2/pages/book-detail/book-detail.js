Page({

  data: {
    departments: [
      'Internal Medicine', 'Surgery', 'Pediatrics',
      'Cardiology', 'Orthopedics', 'ENT'
    ],
    selectedDept: 'Internal Medicine',
    doctors: [
      { name: 'Dr. Wang',  dept: 'Internal Medicine', slots: ['9:00', '9:30', '10:00', '10:30'], location: '2F · Room 203' },
      { name: 'Dr. Li',    dept: 'Internal Medicine', slots: ['10:00', '10:30', '11:00'],       location: '2F · Room 205' },
      { name: 'Dr. Chen',  dept: 'Surgery',           slots: ['14:00', '14:30', '15:00'],       location: '3F · Room 308' },
      { name: 'Dr. Liu',   dept: 'Pediatrics',        slots: ['9:00', '9:30', '10:00'],         location: '1F · Room 102' },
      { name: 'Dr. Zhang', dept: 'Cardiology',        slots: ['9:30', '10:00', '10:30', '11:00'], location: '2F · Room 210' },
      { name: 'Dr. Zhao',  dept: 'Orthopedics',       slots: ['14:00', '15:00', '16:00'],       location: '1F · Room 115' },
      { name: 'Dr. Wu',    dept: 'ENT',               slots: ['9:00', '10:00', '11:00'],         location: '3F · Room 321' }
    ],
    selectedDoctor: '',
    selectedTime: '',
    selectedLocation: '',
    filteredDoctors: [],
    currentSlots: [],
    showSuccess: false,
    titleScale: 100,
    bodyScale: 100
  },

  onLoad() {
    const cfg = getApp().getFontConfig();
    this.setData({ titleScale: cfg.titleScale, bodyScale: cfg.bodyScale });
    this.filterByDept(this.data.selectedDept);
  },

  filterByDept(dept) {
    const filtered = this.data.doctors.filter(d => d.dept === dept);
    this.setData({
      selectedDept: dept,
      filteredDoctors: filtered,
      selectedDoctor: '',
      currentSlots: [],
      selectedTime: '',
      selectedLocation: ''
    });
  },

  onSelectDept(e) {
    const dept = e.currentTarget.dataset.dept;
    if (dept === this.data.selectedDept) return;
    this.filterByDept(dept);
  },

  onSelectDoctor(e) {
    const name = e.currentTarget.dataset.doctor;
    if (name === this.data.selectedDoctor) {
      // deselect
      this.setData({ selectedDoctor: '', selectedLocation: '', currentSlots: [], selectedTime: '' });
      return;
    }
    const doctor = this.data.doctors.find(d => d.name === name);
    this.setData({
      selectedDoctor: name,
      selectedLocation: doctor ? doctor.location : '',
      currentSlots: doctor ? doctor.slots : [],
      selectedTime: ''
    });
  },

  onSelectTime(e) {
    const slot = e.currentTarget.dataset.slot;
    this.setData({
      selectedTime: this.data.selectedTime === slot ? '' : slot
    });
  },

  onConfirm() {
    if (!this.data.selectedTime) return;
    this.setData({ showSuccess: true });
  },

  hideSuccess() {
    this.setData({ showSuccess: false });
  },

  goHome() {
    wx.navigateBack({ delta: 1 });
  }
});
