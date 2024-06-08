import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from '../../components/components.module';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { VerifyEmailPage } from './verify-email.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyEmailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    TranslateModule,
  ],
  declarations: [VerifyEmailPage]
})
export class VerifyEmailPageModule {}
