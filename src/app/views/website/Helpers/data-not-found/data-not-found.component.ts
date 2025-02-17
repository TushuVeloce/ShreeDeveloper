import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'Data-Not-Found',
  standalone: false,
  template: `
  <div ngClass="card-body_light">
  <div style="height: 58vh;" class="d-flex align-items-center justify-content-center">
    <span ngClass="title_light">
      Data Not Found
    </span>
  </div>
</div>
  `,
  styles: `
  //  .card-body_light {
  //   background-color: rgb(229, 231, 235);  }
  
  //   .card-body_dark {
  //       background-color: rgb(34, 34, 34);
  //   }
  
  // .title_light {
  //   color: black;
  //   font-weight: bold;
  //   font-size: 20px;
  //   }
    
  // .title_dark {
  //   color: white;
  // font-weight: bold;
  // font-size: 20px;
  // }
  `,
})
export class DataNotFoundComponent  implements OnInit {

  constructor(public themeService: ThemeService) {}

  ngOnInit() {}

}
