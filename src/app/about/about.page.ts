import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../language/language.service';

@Component({
  selector: 'app-about-page',
  templateUrl: 'about.page.html',
  styleUrls: [
    './styles/about.page.scss'
  ]
})

export class AboutPage {
  translations;
  constructor(private modalController: ModalController,   public languageService: LanguageService,
    public translate: TranslateService,) { }

  dismiss(): void {
    this.modalController.dismiss();
  
  }
    ngOnInit(): void {
      this.getTranslations();
  
      this.translate.onLangChange.subscribe(()=> this.getTranslations());
    }

    getTranslations() {
      // get translations for this page to use in the Language Chooser Alert
      this.translate.getTranslation(this.translate.currentLang)
      .subscribe((translations) => this.translations = translations);
    }
}
