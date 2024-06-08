import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';

import { IonicModule } from '@ionic/angular';

import { ChallengesListUserPageRoutingModule } from './challenges-list-user-routing.module';

import { ChallengesListUserPage } from './challenges-list-user.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChallengesListUserPageRoutingModule,ComponentsModule,
    TranslateModule
  ],
  declarations: [ChallengesListUserPage]
})
export class ChallengesListUserPageModule {}
