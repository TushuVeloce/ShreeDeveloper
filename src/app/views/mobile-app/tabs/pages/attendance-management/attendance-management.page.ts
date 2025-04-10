import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-attendance-management',
  templateUrl: './attendance-management.page.html',
  styleUrls: ['./attendance-management.page.scss'],
  standalone:false
})
export class AttendanceManagementPage implements OnInit {

  todayDate = new Date().toDateString();
  punchModalOpen = false;
  currentPunchType = 'in';
  selectedLocation: string = '';
  isPunchInEnabled = false;
  isPunchOutEnabled = true;
  locations = ['Office', 'Remote', 'Site'];
  isPunchInTime = "09:05 AM 09-04-2025";
  isPunchOutTime = "06:00 PM 09-04-2025";
  totalHalfDays = 2;
  totalOvertime = '16 hrs';

  recentAttendance = [
    { date: 'Apr 8', punchIn: '09:05 AM', punchOut: '06:00 PM', hours: '9h' },
    { date: 'Apr 7', leave: true },
    { date: 'Apr 6', punchIn: '09:20 AM', punchOut: '06:10 PM', hours: '8.5h' },
    { date: 'Apr 5', punchIn: '08:55 AM', punchOut: '06:30 PM', hours: '9.5h' },
    { date: 'Apr 4', leave: true },
    { date: 'Apr 3', punchIn: '09:15 AM', punchOut: '06:00 PM', hours: '8.75h' },
    { date: 'Apr 2', punchIn: '09:10 AM', punchOut: '06:05 PM', hours: '9h' },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.isPunchInEnabled = true;
    this.isPunchOutEnabled = false;
  }

  async takePhoto(type: 'before' | 'after') {
    try {
      // const image = await Camera.getPhoto({
      //   quality: 90,
      //   allowEditing: false,
      //   resultType: CameraResultType.DataUrl,
      //   source: CameraSource.Camera
      // });

      // console.log(`Captured ${type} photo:`, image.dataUrl);
      // Optionally store it for preview or upload
      // this[type + 'Photo'] = image.dataUrl;

    } catch (error) {
      console.error(`Error taking ${type} photo`, error);
    }
  }

  openPunchModal(type: 'in' | 'out') {
    this.currentPunchType = type;
    this.punchModalOpen = true;
  }

  // takePhoto(type: 'before' | 'after') {
  //   console.log(`Take photo (${type})`);
  // }

  submitPunch() {
    console.log(`Punch ${this.currentPunchType} submitted at ${new Date().toLocaleTimeString()} from ${this.selectedLocation}`);

    if (this.currentPunchType === 'in') {
      this.isPunchInEnabled = false;   // Disable Punch In
      this.isPunchOutEnabled = true;   // Enable Punch Out
    } else {
      this.isPunchInEnabled = true;    // Enable Punch In
      this.isPunchOutEnabled = false;  // Disable Punch Out
    }

    this.punchModalOpen = false;
  }

  getSalarySlip() {
    console.log('Getting salary slip...');
    this.viewMore();
  }

  requestLeave() {
    console.log('Requesting leave...');
  }
  viewMore() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/attendance-details']);
  }
  viewAllAttendance() {
    console.log('Viewing full attendance...');
  }
}
