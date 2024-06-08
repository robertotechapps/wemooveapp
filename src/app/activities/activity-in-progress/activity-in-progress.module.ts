import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from '../../components/components.module';

import { ActivityInProgressPage } from './activity-in-progress.page';

import { LanguageService } from '../../language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceMotion } from '@awesome-cordova-plugins/device-motion/ngx';
import { PipesModule } from '../../pipes/pipes.module';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

const routes: Routes = [
  {
    path: '',
    component: ActivityInProgressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,

    RouterModule.forChild(routes),
    TranslateModule,PipesModule
  ],
  declarations: [ActivityInProgressPage],
  providers: [LanguageService, DeviceMotion, Vibration]
})
export class ActivityInProgressPageModule {}
