import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, isPlatform, MenuController, ModalController } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service';
import { UiServiceService } from '../services/ui-service.service';
import { LanguageService } from '../language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../services/user.service';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './styles/login.page.scss'
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  translations;
  isIos=false;
  user=null;
  validation_messages = {
    'email': [
      { type: 'required', message: 'EMAIL_REQUERIDO' },
      { type: 'pattern', message: 'EMAIL_PATTERN' }
    ],
    'password': [
      { type: 'required', message: 'PASSWORD_REQUERIDA' },
      { type: 'minlength', message: 'PASSWORD_REQUERIDA' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    private authServ: AuthServiceService,
    private uiServ: UiServiceService,
    public translate: TranslateService,
    public languageService: LanguageService,
    public modalController: ModalController
  ) {
    this.loginForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required
      ]))
    });

    if (isPlatform("ios")) {
      this.isIos=true;
    }
  }

  ngOnInit(): void{
    this.translate.onLangChange.subscribe(()=> this.getTranslations());
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  doLogin(): void {

    var  email=this.loginForm.value.email;
    var  pass=this.loginForm.value.password;
    
    this.uiServ.presentLoading();
    this.authServ.login(email, pass,false).then( async () => {
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


  goToForgotPassword(): void {
    this.router.navigate(['auth/forgot-password']);
    console.log('redirect to forgot-password page');
  }

  showTermsModal = async () => {
    window.open('https://www.demo.karmasoft.online/#/terms&conditions' );
  };

async signOut(){
  await GoogleAuth.signOut();
  this.user=null;
}

async refresh(){
  const authCode= await GoogleAuth.refresh();
  console.log('refresh:',authCode);
}

}
