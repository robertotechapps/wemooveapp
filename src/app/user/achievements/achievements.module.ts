import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AchievementsPageRoutingModule } from './achievements-routing.module';

import { AchievementsPage } from './achievements.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AchievementsPageRoutingModule,ComponentsModule,ReactiveFormsModule
  ],
  declarations: [AchievementsPage]
})
export class AchievementsPageModule {}
