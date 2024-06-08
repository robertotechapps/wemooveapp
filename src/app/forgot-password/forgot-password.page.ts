import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UiServiceService } from '../services/ui-service.service';
import { AuthServiceService } from '../services/auth-service.service';
import { LanguageService } from '../language/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: [
    './styles/forgot-password.page.scss'
  ]
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup;
  translations;
 
  validation_messages = {
    'email': [
      { type: 'required', message: 'EMAIL_REQUERIDO' },
      { type: 'pattern', message: 'EMAIL_PATTERN' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    private uiServ: UiServiceService,
    private authServ: AuthServiceService,
    public translate: TranslateService,
    public languageService: LanguageService,

  ) {
    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => this.getTranslations());
  }
  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  recoverPassword(): void {
    this.uiServ.presentLoading();

    this.authServ.forgotPassword(this.forgotPasswordForm.value.email).then( () => {
      //navegar
      this.uiServ.dismissLoading();
      this.uiServ.alertaGoRoute('Verify your email','auth/verifyCode');

      }
    )
    .catch(async rej => {
      this.uiServ.dismissLoading();
        this.uiServ.alertaInformativa(rej.message);
    });

  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

}
