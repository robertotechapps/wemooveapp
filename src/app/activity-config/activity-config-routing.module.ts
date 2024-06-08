import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityConfigPage } from './activity-config.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityConfigPageRoutingModule {}
