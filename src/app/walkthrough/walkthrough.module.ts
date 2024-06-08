import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../components/components.module';

import { WalkthroughPage } from './walkthrough.page';
import { WalkthoughResolver } from './walkthrough.resolver';

import { LanguageService } from '../language/language.service';
import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
  {
    path: '',
    component: WalkthroughPage,
    resolve: {data: WalkthoughResolver}
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [WalkthroughPage],
  providers: [WalkthoughResolver, LanguageService]
})
export class WalkthroughPageModule {}
