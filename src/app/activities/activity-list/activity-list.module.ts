import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';

import { IonicModule } from '@ionic/angular';

import { ActivityListPage } from './activity-list.page';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../language/language.service';

import { PipesModule } from 'src/app/pipes/pipes.module';
const routes: Routes = [
  {
    path: '',
    component: ActivityListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule, ComponentsModule,
    PipesModule
  ],
  declarations: [ActivityListPage],
  providers: [LanguageService]
})
export class ActivityListPageModule {}
