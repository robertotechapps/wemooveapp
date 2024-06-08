import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AchievementsDetailPageRoutingModule } from './achievements-detail-routing.module';

import { AchievementsDetailPage } from './achievements-detail.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AchievementsDetailPageRoutingModule,ComponentsModule
  ],
  declarations: [AchievementsDetailPage]
})
export class AchievementsDetailPageModule {}
