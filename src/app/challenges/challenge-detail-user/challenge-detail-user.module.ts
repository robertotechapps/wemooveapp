import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChallengeDetailUserPageRoutingModule } from './challenge-detail-user-routing.module';

import { ChallengeDetailUserPage } from './challenge-detail-user.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,TranslateModule,PipesModule,
    ChallengeDetailUserPageRoutingModule,ComponentsModule
  ],
  declarations: [ChallengeDetailUserPage]
})
export class ChallengeDetailUserPageModule {}
