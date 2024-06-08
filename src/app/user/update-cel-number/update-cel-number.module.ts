import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateCelNumberPageRoutingModule } from './update-cel-number-routing.module';

import { UpdateCelNumberPage } from './update-cel-number.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateCelNumberPageRoutingModule
  ],
  declarations: [UpdateCelNumberPage]
})
export class UpdateCelNumberPageModule {}
