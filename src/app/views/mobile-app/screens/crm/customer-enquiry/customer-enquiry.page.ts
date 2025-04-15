import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-enquiry',
  templateUrl: './customer-enquiry.page.html',
  styleUrls: ['./customer-enquiry.page.scss'],
  standalone:false
})
export class CustomerEnquiryPage implements OnInit {

  ngOnInit() {
  }
  // tasks = [
  //   { id: '1', title: 'Task 1', description: 'Description 1' },
  //   { id: '2', title: 'Task 2', description: 'Description 2' }
  // ];
  EnquiryData = [
    {
      name: "Sami Zedian",
      location: "UK London",
      rating: 4.1,
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      languages: ["ENGLISH", "ARABIC", "PORTUGUESE"],
      description: "Bachelor’s of Sciences in Humandevelopmental Psychological Services"
    },
    {
      name: "Yasmin niaq",
      location: "UK London",
      rating: 2.4,
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      languages: ["ENGLISH", "ARABIC", "PORTUGUESE"],
      description: "Qualified teacher, working in international British school in Spain..."
    },
    {
      name: "Zchi Franadis",
      location: "UK London",
      rating: 3.1,
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      languages: ["ENGLISH", "PORTUGUESE"],
      description: "Qualified teacher working in international British school..."
    }
  ];


  constructor(private router: Router) { }

  addTask() {
    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/add']); // ✅ Navigate to Add Page
  }

  editTask(taskId: string) {
    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry/edit', taskId]); // ✅ Navigate to Edit Page
  }

}
