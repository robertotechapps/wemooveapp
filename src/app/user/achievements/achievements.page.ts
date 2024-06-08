import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AchievementService } from 'src/app/services/achievement.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { AchievementModel } from 'src/app/models/achievement.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
})
export class AchievementsPage implements OnInit {
  translations;
  achievementList:AchievementModel[] = [];

  constructor(private router:Router,
     private achievementServ:AchievementService, 
      private uiServ: UiServiceService,
      public translate: TranslateService) { 

  }

  async ngOnInit() {
    this.uiServ.presentLoading();
    await this.achievementServ.getAchievements().then(() =>{
      this.achievementList=this.achievementServ.achievementList;
      this.uiServ.dismissLoading();
    });
    this.uiServ.dismissLoading();
    this.getTranslations();
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  verLogro(id: number){

    let navigationExtras: NavigationExtras = {
      state: {
        achievement: this.achievementList.find( x=> x.id == id)
      }
    };

    this.router.navigate(['/achievements-detail'],navigationExtras);
  }

}
