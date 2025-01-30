import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estimate-stages-details',
  templateUrl: './estimate-stages-details.component.html',
  standalone: false,
  styleUrls: ['./estimate-stages-details.component.scss'],
})
export class EstimateStagesDetailsComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  BackEstimateStage() {
    this.router.navigate(['/homepage/Website/Estimate_Stages']);
  }

}
