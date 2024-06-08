import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityDetailPage } from './activity-detail.page';
import { ComponentsModule } from '../../components/components.module';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../language/language.service';

const routes: Routes = [
  {
    path: '',
    component: ActivityDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [ActivityDetailPage],
  providers: [LanguageService]
})
export class ActivityDetailPageModule {}
