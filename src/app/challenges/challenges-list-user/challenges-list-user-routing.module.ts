import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChallengesListUserPage } from './challenges-list-user.page';
import { ChallengeListUserResolver } from './challenge-list-user.resolver';

const routes: Routes = [
  {
    path: '',
    component: ChallengesListUserPage,
    resolve: {data:ChallengeListUserResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[ChallengeListUserResolver]
})
export class ChallengesListUserPageRoutingModule {}
