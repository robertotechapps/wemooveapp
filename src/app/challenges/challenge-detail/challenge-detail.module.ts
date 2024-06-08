import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChallengeDetailPageRoutingModule } from './challenge-detail-routing.module';

import { ChallengeDetailPage } from './challenge-detail.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,TranslateModule,
    ChallengeDetailPageRoutingModule,ComponentsModule
  ],
  declarations: [ChallengeDetailPage]
})
export class ChallengeDetailPageModule {}
