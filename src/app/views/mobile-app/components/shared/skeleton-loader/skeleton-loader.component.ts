// import { Component, Input, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-skeleton-loader',
//   templateUrl: './skeleton-loader.component.html',
//   styleUrls: ['./skeleton-loader.component.scss'],
//   standalone: false
// })
// export class SkeletonLoaderComponent  implements OnInit {
//   @Input() count = 3;
//   constructor() { }

//   ngOnInit() {}

// }
// // <app-skeleton - loader * ngIf="loading"[count] = "5" > </app-skeleton>


import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
  standalone: false
})
export class SkeletonLoaderComponent {
  @Input() count = 3;

  get skeletons() {
    return Array(this.count);
  }

  trackByIndex(index: number): number {
    return index;
  }
}

// <app-skeleton-loader - loader * ngIf="isLoading"[count] = "5" > </app-skeleton-loader>
