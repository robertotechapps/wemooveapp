import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WOrderPage } from './worder.page';

const routes: Routes = [
  {
    path: '',
    component: WOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WOrderPageRoutingModule {}
