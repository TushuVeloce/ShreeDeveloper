import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-salary-slip-mobile-app',
  templateUrl: './salary-slip-mobile-app.component.html',
  styleUrls: ['./salary-slip-mobile-app.component.scss'],
  standalone: false
})

export class SalarySlipMobileAppComponent implements OnInit {
  modalOpen = false;
  selectedSlip: any = null;

  openSalarySlipModal(slip: any) {
    this.selectedSlip = slip;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedSlip = null;
  }

  selectedStatus = 'approved';
  salarySlips = [
    {
      id: 1,
      month: 'March',
      year: 2024,
      requestDate: new Date(),
      status: 'pending',
      employeeName: 'John Doe'
    },
    {
      id: 4,
      month: 'March',
      year: 2024,
      requestDate: new Date(),
      status: 'pending',
      employeeName: 'John Doe'
    },
    {
      id: 2,
      month: 'February',
      year: 2024,
      requestDate: new Date(),
      status: 'approved',
      employeeName: 'Jane Smith'
    },
    {
      id: 3,
      month: 'January',
      year: 2024,
      requestDate: new Date(),
      status: 'rejected',
      employeeName: 'Alice Johnson'
    }
  ];

  filteredSlips: any = [];

  ngOnInit() {
    this.filterSalarySlips();
  }

  filterSalarySlips() {
    this.filteredSlips = this.salarySlips.filter(slip => slip.status === this.selectedStatus);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'medium';
    }
  }

  viewSlip(slip: any) {
    console.log('Viewing slip', slip);
    this.openSalarySlipModal(slip);
    // Navigate or open modal
  }

  downloadSlip(slip: any) {
    console.log('Downloading slip', slip);
    // Handle file download logic
  }

  constructor(private modalController: ModalController, private router: Router) { }


  addTask() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/add-salary-slip']); // ✅ Navigate to Add Page
  }

  editTask(id: string) {
    this.router.navigate(['/app_homepage/tabs/attendance-management/add-salary-slip']); // ✅ Navigate to Edit Page
  }


}
