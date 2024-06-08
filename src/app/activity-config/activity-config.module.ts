import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityConfigPageRoutingModule } from './activity-config-routing.module';

import { ActivityConfigPage } from './activity-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityConfigPageRoutingModule
  ],
  declarations: [ActivityConfigPage]
})
export class ActivityConfigPageModule {}
