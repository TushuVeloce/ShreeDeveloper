import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attendance-and-salary',
  templateUrl: './attendance-and-salary.component.html',
  styleUrls: ['./attendance-and-salary.component.scss'],
  standalone: false,
})
export class AttendanceAndSalaryComponent implements OnInit {
  SearchString : string = ''
  constructor() {}

  ngOnInit() {}

  filterTable = () => {};
}
