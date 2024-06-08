import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '../../components/components.module';
import { IonicModule } from '@ionic/angular';

import { MyActivitiesPage } from './my-activities.page';
import { RouterModule, Routes } from '@angular/router';
import { LanguageService } from '../../language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import {PipesModule} from '../../pipes/pipes.module'

const routes: Routes = [
  {
    path: '',
    component: MyActivitiesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    TranslateModule, PipesModule
  ],
  declarations: [MyActivitiesPage],
  providers: [LanguageService]
})
export class MyActivitiesPageModule {}
