import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import * as console from 'console';
import { ChallengeService } from '../../services/challenge.service';
import { ChallengeModel } from '../../models/challenge.model';
import { TranslateService } from '@ngx-translate/core';
import { ActivityService } from '../../services/activity.service';
import { UserModel } from 'src/app/models/user-profile.model';
import { UserService } from 'src/app/services/user.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-challenge-detail',
  templateUrl: './challenge-detail.page.html',
  styleUrls: ['./challenge-detail.page.scss'],
})
export class ChallengeDetailPage implements OnInit {
  translations;
  challengeId:number;
  challenge: ChallengeModel;
  user: UserModel;

  constructor(private router: Router, private route: ActivatedRoute, public translate: TranslateService,
    private activityService: ActivityService,
    private challengeSer: ChallengeService,
    private usrServ: UserService, private uiServ: UiServiceService
    ) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.challengeId = this.router.getCurrentNavigation().extras.state.challengeId;
      }
    });
  }

  async ngOnInit() {
    this.user= await this.usrServ.usuario;
    this.challenge= await this.challengeSer.getChallenge(this.challengeId);
    this.getTranslations();
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  async iniciarDesafio(){
    if (!this.challenge || (this.challenge && this.challenge.id != this.challenge.id)) {
      this.uiServ.presentLoading()
      this.challengeSer.joinChallenge(this.challenge.id).then(async () => {
  
        this.usrServ.getUsrCurrentChallenge();
        await this.activityService.getActivityType(this.challenge.activity_type_id);
        this.uiServ.dismissLoading();
        this.router.navigate(['/activity-in-progress']);
      })
      .catch(async rej => {
        this.uiServ.dismissLoading();
        this.uiServ.alertaInformativa(rej.message);
       })
  } else {
    ;
    let navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usrServ.usuarioDetail,
        charity: this.usrServ.usuarioCharity,
        challenge: this.usrServ.usuarioChallenge,
        activityType: await this.activityService.getActivityType(this.challenge.activity_type_id)
      }
    };
    this.router.navigate(['/activity-in-progress'], navigationExtras);
  }
  }
  async cambiarDesafio(){
    await this.challengeSer.getChallengeList('available');
    this.router.navigate(['/challenges']);
  }
}
