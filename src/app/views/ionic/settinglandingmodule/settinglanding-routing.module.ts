import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettinglandingModule } from './settinglanding.module';
import { SettingLandingComponent } from './setting-landing.component';
import { SettingsLandingViewComponent } from './components/settings-landing-view/settings-landing-view.component';

const routes: Routes = [
   {
      path: '', component: SettingLandingComponent,
      children:
        [
          { path: '', component: SettingsLandingViewComponent }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettinglandingRoutingModule { }
