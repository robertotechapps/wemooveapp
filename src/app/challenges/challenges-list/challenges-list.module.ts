import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';

import { IonicModule } from '@ionic/angular';

import { ChallengesListPageRoutingModule } from './challenges-list-routing.module';

import { ChallengesListPage } from './challenges-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChallengesListPageRoutingModule,ComponentsModule,
    TranslateModule, PipesModule
  ],
  declarations: [ChallengesListPage]
})
export class ChallengesListPageModule {}
