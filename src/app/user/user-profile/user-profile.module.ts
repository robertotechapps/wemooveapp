import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { UserProfilePage } from './user-profile.page';
import { LanguageService } from '../../language/language.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,ComponentsModule,
    UserProfilePageRoutingModule
  ],
  declarations: [UserProfilePage],
  providers:[LanguageService]
})
export class UserProfilePageModule {}
