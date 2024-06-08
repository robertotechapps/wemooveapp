import { Component } from '@angular/core';

import { LanguageService } from '../language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UiServiceService } from '../services/ui-service.service';
import { UserService } from '../services/user.service';

import { error } from 'protractor';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.page.html',
  styleUrls: [
    './styles/getting-started.page.scss',
    './styles/getting-started.shell.scss',
    './styles/getting-started.responsive.scss'
  ]
})
export class GettingStartedPage  {

  translations;
  user=null;
  isIos=false;

  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public menu: MenuController,
    public modalController: ModalController,
    public router: Router,
    public uiServ: UiServiceService, 
    public usrService: UserService
  ) { 

  }

  async ngOnInit(): Promise<void> {
    this.translate.onLangChange.subscribe(() => this.getTranslations());
  }


  showTermsModal = async () => {
    window.open('https://www.demo.karmasoft.online/#/terms&conditions' );
  };

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

}
