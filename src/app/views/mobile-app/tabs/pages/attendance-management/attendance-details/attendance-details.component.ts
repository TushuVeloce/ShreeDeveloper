import { Component, OnInit } from '@angular/core';

interface AttendanceDay {
  date: string;
  day: string;
  clockIn?: string | null;
  clockOut?: string | null;
  hours?: string | null;
  isWeekend?: boolean;
  leave?: string;
  isHalfDay: boolean;
}

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.scss'],
  standalone: false
})
export class AttendanceDetailsComponent implements OnInit {

  months = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];
  selectedMonth: number = new Date().getMonth();
  attendanceData: AttendanceDay[] = [];

  constructor() { }

  ngOnInit() {
    this.getDataByMonth(this.selectedMonth);
  }

  async getDataByMonth(month: any): Promise<void> {
    if (month === undefined) return;
    this.selectedMonth = month;
    console.log("Selected Month:", month);
    console.log("Fetching data for month:", this.months[month]?.label);

    // Replace with API call in production
    this.attendanceData = [
      { date: '30', day: 'TUE', clockIn: '09:00am', clockOut: '06:00pm', hours: '09hr 00min', isHalfDay: false },
      { date: '29', day: 'MON', clockIn: '09:10am', clockOut: '01:00pm', hours: '03hr 50min', isHalfDay: true },
      { date: '28', day: 'SUN', isWeekend: true, isHalfDay: false },
      { date: '27', day: 'SAT', isWeekend: true, isHalfDay: false },
      { date: '26', day: 'FRI', clockIn: '09:15am', clockOut: '06:20pm', hours: '09hr 05min', isHalfDay: false },
      { date: '25', day: 'THU', leave: 'Casual Leave', isHalfDay: false },
      { date: '24', day: 'WED', clockIn: '09:05am', clockOut: '06:00pm', hours: '08hr 55min', isHalfDay: false },
      { date: '23', day: 'TUE', clockIn: '09:30am', clockOut: '12:30pm', hours: '03hr 00min', isHalfDay: true },
      { date: '22', day: 'MON', clockIn: '09:10am', clockOut: '06:10pm', hours: '09hr 00min', isHalfDay: false },
      { date: '21', day: 'SUN', isWeekend: true, isHalfDay: false },
      { date: '20', day: 'SAT', isWeekend: true, isHalfDay: false },
      { date: '19', day: 'FRI', clockIn: '09:00am', clockOut: '06:00pm', hours: '09hr 00min', isHalfDay: false },
      { date: '18', day: 'THU', clockIn: '09:35am', clockOut: '01:00pm', hours: '03hr 25min', isHalfDay: true },
      { date: '17', day: 'WED', clockIn: '09:00am', clockOut: '06:00pm', hours: '09hr 00min', isHalfDay: false },
      { date: '16', day: 'TUE', clockIn: '09:00am', clockOut: null, hours: null, isHalfDay: false },
      { date: '15', day: 'MON', leave: 'Medical Leave', isHalfDay: false },
      { date: '14', day: 'SUN', isWeekend: true, isHalfDay: false },
      { date: '13', day: 'SAT', isWeekend: true, isHalfDay: false },
      { date: '12', day: 'FRI', clockIn: '09:20am', clockOut: '05:40pm', hours: '08hr 20min', isHalfDay: false },
      { date: '11', day: 'THU', clockIn: '10:00am', clockOut: '01:30pm', hours: '03hr 30min', isHalfDay: true },
      { date: '10', day: 'WED', clockIn: '09:10am', clockOut: '06:00pm', hours: '08hr 50min', isHalfDay: false },
      { date: '09', day: 'TUE', clockIn: '09:15am', clockOut: '06:10pm', hours: '08hr 55min', isHalfDay: false },
      { date: '08', day: 'MON', clockIn: '09:25am', clockOut: null, hours: null, isHalfDay: false },
      { date: '07', day: 'SUN', isWeekend: true, isHalfDay: false },
      { date: '06', day: 'SAT', isWeekend: true, isHalfDay: false },
      { date: '05', day: 'FRI', clockIn: '09:10am', clockOut: '06:30pm', hours: '09hr 20min', isHalfDay: false },
      { date: '04', day: 'THU', clockIn: '09:00am', clockOut: '06:00pm', hours: '09hr 00min', isHalfDay: false },
      { date: '03', day: 'WED', clockIn: '09:00am', clockOut: '12:00pm', hours: '03hr 00min', isHalfDay: true },
      { date: '02', day: 'TUE', leave: 'Personal Leave', isHalfDay: false },
      { date: '01', day: 'MON', clockIn: '09:15am', clockOut: '06:00pm', hours: '08hr 45min', isHalfDay: false },
    ];

    // this.attendanceData = [];
  }
}
