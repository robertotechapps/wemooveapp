import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDetailModel } from '../models/user-profile.model';
import { UiServiceService } from '../services/ui-service.service';
import { UserService } from '../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit, OnDestroy {

  stateSubscription: Subscription;
  usrLogueado: UserDetailModel;
  avatarsrc: string;
  translations;

  constructor(private uiServ: UiServiceService,
              public translate: TranslateService,
             public usrService: UserService,private navCtrl: NavController
    ) { }

  async ngOnInit() {
    this.uiServ.presentLoading();
     if (await this.usrService.ValidarToken()) {
      this.stateSubscription = this.usrService.userDetail$.subscribe(resp=>{
        console.log('hihih', resp);
        this.uiServ.dismissLoading();
        this.navCtrl.navigateRoot('/activities');
       })
    } else{
      this.uiServ.dismissLoading();
      this.navCtrl.navigateRoot('/getting-started');
    }
  }

  ngOnDestroy(): void {
    if(this.stateSubscription)
      this.stateSubscription.unsubscribe();
  }

  setLanguage(lang: string) {
    this.translate.setDefaultLang('en');
    this.translate.use(lang);
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }
}
