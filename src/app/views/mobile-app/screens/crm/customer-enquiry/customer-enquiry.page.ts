import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-enquiry',
  templateUrl: './customer-enquiry.page.html',
  styleUrls: ['./customer-enquiry.page.scss'],
  standalone: false
})
export class CustomerEnquiryPage implements OnInit {
  ModalOpen = false;
  selectedItem: any =[];

  customerList = [
    {
      date: '2024-04-14',
      name: 'John Doe',
      contact: '9876543210',
      status: 'Active',
      siteName: 'Skyline Villas',
      plotNo: 'A-12',
    },
    {
      date: '2024-04-13',
      name: 'Jane Smith',
      contact: '8765432109',
      status: 'Inactive',
      siteName: 'Green Heights',
      plotNo: 'B-7',
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() { }

  // Handle View Action
  onView(item: any) {
    console.log('Viewing', item);
    this.selectedItem=item;
    this.openModal();
  }

  // Handle Edit
  onEdit(item: any) {
    console.log('Editing', item);
    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/edit', item.plotNo]);
  }

  // Handle Delete
  onDelete(item: any) {
    console.log('Deleting', item);
    // Add actual delete logic here
  }

  // Open Modal
  openModal = () => {
    this.ModalOpen = true;
  }

  // Close Modal
  ModelClose = () => {
    this.ModalOpen = false;
  }

  // Navigate to Add Page
  addTask() {
    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/add']);
  }

  // Example filter action
  filterCustomerList() {
    console.log('Filtering customers...');
    // You can later implement actual filters here
  }

}
