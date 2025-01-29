import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLandingComponent } from './home-landing.component';
import { HomeLandingViewComponent } from './components/home-landing-view/home-landing-view.component';

const routes: Routes = [
  { path: '', component: HomeLandingComponent
    ,children:
    [
      {path:'',component:HomeLandingViewComponent}
    ]
   },
  // { path: 'detail', component: HomeDetailComponent }, // Example of a nested page
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
