import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateCelNumberPage } from './update-cel-number.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateCelNumberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateCelNumberPageRoutingModule {}
