import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UiServiceService } from '../../services/ui-service.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { TranslateService } from '@ngx-translate/core';
import { PasswordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.page.html',
  styleUrls: [
    '../styles/forgot-password.page.scss'
  ]
})
export class VerifyCodePage implements OnInit {

  initialEmail: string ='';
  verifyForm: FormGroup;
  translations;

  validation_messages = {
    'code': [
      { type: 'required', message: 'Code is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' }
    ],
    'password': [
      { type: 'required', message: 'PASSWORD_REQUERIDA' },
      { type: 'minlength', message: 'PASSWORD_MINLENGTH' }
    ],
    'confirm_password': [
      { type: 'required', message: 'CONFIRMAR_CONTRASEÑA' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'CONTRASEÑA_NO_COINCIDE' }
    ]
  };
  matching_passwords_group: FormGroup;
  
  constructor(public router: Router, 
    private uiServ: UiServiceService,
    private authServ: AuthServiceService,
    public translate: TranslateService
    ) { 

    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });
    this.verifyForm = new FormGroup({
      'code': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'matching_passwords': this.matching_passwords_group
      
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
     this.authServ.resetPassword(this.verifyForm.value.code, this.verifyForm.value.email, this.matching_passwords_group.value.password,  this.matching_passwords_group.value.password).then( () => {
      this.uiServ.dismissLoading();
       this.uiServ.alertaGoRoute('Password reset','auth/login');
       // this.router.navigate(['app/activities']);
     }
     )
     .catch(async rej => {
       this.uiServ.dismissLoading();
         this.uiServ.alertaInformativa(rej.message);
     });
  }

}
