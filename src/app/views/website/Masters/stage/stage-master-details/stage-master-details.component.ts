import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stage-master-details',
  standalone: false,
  templateUrl: './stage-master-details.component.html',
  styleUrls: ['./stage-master-details.component.scss'],
})
export class StageMasterDetailsComponent  implements OnInit {

 constructor( private router: Router) { }
 
   ngOnInit() {}
   BackMaterial(){
     this.router.navigate(['/homepage/Website/Stage_Master']);
    }
}
