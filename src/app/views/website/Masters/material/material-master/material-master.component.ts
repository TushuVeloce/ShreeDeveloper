import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-master',
  standalone: false,
  templateUrl: './material-master.component.html',
  styleUrls: ['./material-master.component.scss'],
})
export class MaterialMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Material Name','Material Unit','Action'];
  constructor( private router:Router) { }

  ngOnInit() {}
  AddMaterial(){
    this.router.navigate(['/homepage/Website/Material_Master_details']);
   }
}
