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
import * as moment from 'moment';

@Component({
  selector: 'app-challenges-list',
  templateUrl: './challenges-list-user.page.html',
  styleUrls: [
    'challenges-list-user.page.scss'
  ]
})
export class ChallengesListUserPage implements OnInit, OnDestroy {
  translations;
  challengeList:Array<ChallengeModel> & ShellModel;
  stateSubscription: Subscription;
  isLoading=true;

  constructor(private router: Router, 
    private uiServ: UiServiceService,
    public actServ: ActivityService,private route: ActivatedRoute,
    public translate: TranslateService, private chaService: ChallengeService) { }

  async ngOnInit() {

    this.route.data.pipe(
      map((resolvedRouteData) => {
        const resolvedDataStores = resolvedRouteData['data'];
        const dataStore: DataStore<Array<ChallengeModel>> = resolvedDataStores;
        
        this.stateSubscription = dataStore.state.subscribe(
          (state) => {
            this.challengeList=state;
            this.isLoading=false;
            console.log('isloadingchall',this.isLoading)
            console.log('state',state)
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

    const aux= this.challengeList.find( x=> x.id == id);
    console.log('aux',aux);
    let navigationExtras: NavigationExtras = {
      state: {
        challengeId: id,
        startedOn : moment(aux['pivot'].created_at,'YYYY-MM-DD').format('DD-MM-YYYY'),
        finishedBy : moment(aux['pivot'].updated_at,'YYYY-MM-DD').format('DD-MM-YYYY') 
        
      }
    };

    this.router.navigate(['/challenge-detail-user'],navigationExtras);
  }
}
