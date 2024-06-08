import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChallengeDetailUserPage } from './challenge-detail-user.page';

const routes: Routes = [
  {
    path: '',
    component: ChallengeDetailUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChallengeDetailUserPageRoutingModule {}
