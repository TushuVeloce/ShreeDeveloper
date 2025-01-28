import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone:false,
})
export class HomeComponent  implements OnInit {
  ngOnInit() {}
  itemList = [
    { name: 'Item 1', description: 'Description 1' },
    { name: 'Item 2', description: 'Description 2' },
    { name: 'Item 3', description: 'Description 3' },
  ];

  tasks = [
    { title: 'Item 1', description: 'Description 1' },
    { title: 'Item 2', description: 'Description 2' },
    { title: 'Item 3', description: 'Description 3' },
    { title: 'Item 1', description: 'Description 1' },
    { title: 'Item 2', description: 'Description 2' },
    { title: 'Item 3', description: 'Description 3' },
  ];

  constructor(private navCtrl: NavController, private themeService: ThemeService) { }


  goToProjects() {
    this.navCtrl.navigateForward('/projects'); // Adjust the route as needed
  }

  goToReports() {
    this.navCtrl.navigateForward('/reports'); // Adjust the route as needed
  }
  // Calls the toggleTheme method in the ThemeService
  // toggleTheme() {
  //   this.themeService.toggleTheme();
  // }
  goTOTask() {
    this.navCtrl.navigateForward('/task'); // Adjust the route as needed
  }

  onItemSelected(item: any) {
    console.log('Item clicked:', item);
  }

  onActionSelected(event: { action: string, item: any }) {
    console.log('Action clicked:', event.action, 'for item:', event.item);
  }

}
