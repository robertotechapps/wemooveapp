import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ChallengeModel } from 'src/app/models/challenge.model';
import { ChallengeService } from '../../services/challenge.service';
import { ActivityService } from '../../services/activity.service';
import { UiServiceService } from '../../services/ui-service.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user-profile.model';
import { Observable, Subscription } from 'rxjs';
import { DataStore, ShellModel } from 'src/app/shell/data-store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-challenges-list',
  templateUrl: './challenges-list.page.html',
  styleUrls: [
    'challenges-list.page.scss'
  ]
})
export class ChallengesListPage implements OnInit, OnDestroy {
  translations;
  challengeList:Array<ChallengeModel> & ShellModel;
  stateSubscription: Subscription;

    constructor(private router: Router, private challengeServ:ChallengeService, 
      private uiServ: UiServiceService,
      public actServ: ActivityService,private route: ActivatedRoute,
      public translate: TranslateService, private userServ: UserService,
      private chaService: ChallengeService
      ) { 
        // this.chaService.getChallengeList('available');
      }

  async ngOnInit() {

    this.route.data.pipe(
      map((resolvedRouteData) => {
        const resolvedDataStores = resolvedRouteData['data'];
        const dataStore: DataStore<Array<ChallengeModel>> = resolvedDataStores;
        
        this.stateSubscription = dataStore.state.subscribe(
          (state) => {
            console.log('challenges',state);
            this.challengeList=state;
          }
        );

      })
    ).subscribe();
    this.getTranslations();
  }
  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  ngOnDestroy(): void {
    if(this.stateSubscription)
      this.stateSubscription.unsubscribe();
  }

  verDesafio(id: number){

    let navigationExtras: NavigationExtras = {
      state: {
        challengeId: id
      }
    };

    this.router.navigate(['/challenge-detail'],navigationExtras);
  }

  joinChallenge(id: number){

    this.uiServ.presentLoading()
    this.challengeServ.joinChallenge(id).then(async () => {

         this.uiServ.dismissLoading();
         this.userServ.getUsrCurrentChallenge();
        //  .then(usr=>{

        //    let navigationExtras: NavigationExtras = {
        //     state: {
        //       challengeId: usr.currentChallenge.challenge.id
        //     }
        //   };
        //   this.router.navigate(['/challenge-detail'], navigationExtras);
        //  });
         this.uiServ.alertaGoRoute('Te has unido al challenge con éxito','/activities')
    })
    .catch(async rej => {
      this.uiServ.dismissLoading();
      this.uiServ.alertaInformativa(rej.message);
     })
  }
}
