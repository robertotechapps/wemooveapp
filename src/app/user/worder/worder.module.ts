import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WOrderPageRoutingModule } from './worder-routing.module';

import { WOrderPage } from './worder.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    WOrderPageRoutingModule,ComponentsModule,ReactiveFormsModule
  ],
  declarations: [WOrderPage]
})
export class WOrderPageModule {}
