import { Component, OnInit } from '@angular/core';
import { IonTitle, IonToolbar, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.page.html',
  styleUrls: ['./task-management.page.scss'],
  standalone:false
})
export class TaskManagementPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
