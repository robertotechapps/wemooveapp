import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UiServiceService } from '../../services/ui-service.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: [
    '../styles/signup.page.scss'
  ]
})
export class VerifyEmailPage implements OnInit {

  initialEmail: string ='';
  verifyForm: FormGroup;
  translations;
  verificationCodes: Array<number>=[95691, 79534, 37961, 89237]
  validation_messages = {
    'code': [
      { type: 'required', message: 'Code is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' }
    ]
  };

  constructor(public router: Router, 
    private uiServ: UiServiceService,
    private authServ: AuthServiceService,
    public translate: TranslateService
    ) { 
    this.verifyForm = new FormGroup({
      'code': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.required)
    });
  }

  async ngOnInit() {
    this.translate.onLangChange.subscribe(() => this.getTranslations());
    this.initialEmail= await this.authServ.getEmailLogin();
    this.verifyForm.patchValue({'email': this.initialEmail});
  }
  
  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  doSignup(): void {
    this.uiServ.presentLoading();
    this.authServ.verifyEmail(this.verifyForm.value.code, this.verifyForm.value.email).then( async () => {
      const email=await this.authServ.getEmailLogin();
      const pass=await this.authServ.getPasswordLogin();
      this.uiServ.dismissLoading();
      this.doLogin(email, pass);
      // this.uiServ.alertaGoRoute('La validación se realizo con éxito.','auth/login');

    }
    )
    .catch(async rej => {
      this.uiServ.dismissLoading();
        this.uiServ.alertaInformativa(rej.message);
    });
  }

  doLogin(email: string, pass: string): void {
    this.uiServ.presentLoading();
    this.authServ.login(email, pass,true).then( async () => {
      this.uiServ.dismissLoading();
      this.router.navigate(['/activities']);
    })
    .catch(async rej => {
      this.uiServ.dismissLoading();
      if(rej?.message && rej.message =="Email not verified."){
        this.uiServ.alertaGoRoute(rej.message,'auth/verifyEmail')
      } else
        this.uiServ.alertaInformativa(rej.message);
    });
    
  }

}
