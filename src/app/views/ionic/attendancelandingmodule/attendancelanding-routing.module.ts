import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendancelandingModule } from './attendancelanding.module';
import { AttendanceLandingViewComponent } from './components/attendance-landing-view/attendance-landing-view.component';
import { AttendanceLandingComponent } from './attendance-landing.component';

const routes: Routes = [
  {
    path: '', component: AttendanceLandingComponent,
    children:
      [
        { path: '', component: AttendanceLandingViewComponent }
      ]
  },
  // { path: 'detail', component: HomeDetailComponent }, // Example of a nested page
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendancelandingRoutingModule { }
