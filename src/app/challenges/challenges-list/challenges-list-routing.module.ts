import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChallengesListPage } from './challenges-list.page';
import { ChallengeListResolver } from './challenge-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: ChallengesListPage,
    resolve: {data:ChallengeListResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[ChallengeListResolver]
})
export class ChallengesListPageRoutingModule {}
