import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pagination',
  standalone: false ,
  template: `
  <div class="fixed-pagination">
  <nz-pagination
    class="try light-theme"
    [nzPageSize]="pageSize"
    [nzTotal]="total"
    [(nzPageIndex)]="currentPage"
    (nzPageIndexChange)="onPageIndexChange($event)"
    [nzShowSizeChanger]="false"
    [nzResponsive]="true"
  >
  </nz-pagination>
</div>
  `,
})
export class PaginationComponent {
  @Input() pageSize: number = 10;
  @Input() total: number = 0;
  @Input() currentPage: number = 1;

  @Output() currentPageChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();

  onPageIndexChange(newPage: number) {
    this.currentPageChange.emit(newPage); // optional 2-way binding
    this.pageChange.emit(newPage); // actual page change logic
  }
}