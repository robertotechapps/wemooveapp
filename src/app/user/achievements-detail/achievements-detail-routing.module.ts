import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AchievementsDetailPage } from './achievements-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AchievementsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AchievementsDetailPageRoutingModule {}
