import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';

import { SelectActivityPage } from './select-activity.page';
import { RouterModule , Routes} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../language/language.service';
import { PipesModule } from 'src/app/pipes/pipes.module';
 import { SelectActivityResolver } from './select-activity.resolver';

const activitiesRoutes: Routes = [
  {
    path: '',
    component: SelectActivityPage,
     resolve: {data: SelectActivityResolver}
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(activitiesRoutes), 
    ComponentsModule, 
    TranslateModule, PipesModule
  ],
  declarations: [SelectActivityPage],
  providers: [LanguageService, SelectActivityResolver]
})
export class SelectActivityPageModule {}
