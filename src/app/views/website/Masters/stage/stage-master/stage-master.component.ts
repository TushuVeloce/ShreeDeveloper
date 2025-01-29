import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stage-master',
  standalone: false,
  templateUrl: './stage-master.component.html',
  styleUrls: ['./stage-master.component.scss'],
})
export class StageMasterComponent  implements OnInit {
  headers: string[] = ['Stage.No.','Stage Name'];
  constructor( private router:Router) { }

  ngOnInit() {}
  AddStage(){
    this.router.navigate(['/homepage/Website/Stage_Master_Details']);
   }
}
