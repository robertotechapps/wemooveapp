import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';
import { ChallengeModel } from '../../models/challenge.model';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user-profile.model';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-challenge-detail',
  templateUrl: './challenge-detail-user.page.html',
  styleUrls: ['./challenge-detail-user.page.scss'],
})
export class ChallengeDetailUserPage implements OnInit {
  translations;
  challengeId:number;
  challenge: ChallengeModel;
  user: UserModel;
  startedOn:string;
  finishedBy:string;
  constructor(private router: Router, private route: ActivatedRoute, public translate: TranslateService,
    private challengeSer: ChallengeService,
    private usrServ: UserService, private uiServ: UiServiceService
    ) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.challengeId = this.router.getCurrentNavigation().extras.state.challengeId;
        this.startedOn = this.router.getCurrentNavigation().extras.state.startedOn;
        this.finishedBy = this.router.getCurrentNavigation().extras.state.finishedBy;
      }
    });
  }

  async ngOnInit() {
    this.user= this.usrServ.usuario;
    this.challenge= await this.challengeSer.getChallenge(this.challengeId);
    this.getTranslations();
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }
}
