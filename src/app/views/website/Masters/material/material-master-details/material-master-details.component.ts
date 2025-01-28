import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-master-details',
  standalone: false,
  templateUrl: './material-master-details.component.html',
  styleUrls: ['./material-master-details.component.scss'],
})
export class MaterialMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}
  BackMaterial(){
    this.router.navigate(['/homepage/Website/Material_Master']);
   }

}
