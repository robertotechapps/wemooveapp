import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UiServiceService } from '../../services/ui-service.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { TranslateService } from '@ngx-translate/core';
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-verify-invitation',
  templateUrl: './verify-invitation.page.html',
  styleUrls: [
    './styles/verify-invitation.page.scss'
  ]
})
export class VerifyInvitationPage implements OnInit {

  tipoLogin: string ='';
  initialEmail: string ='';
  verifyForm: FormGroup;
  translations;
  verificationCodes: Array<number>=[95691, 79534, 37961, 89237]
  user=null;
  validation_messages = {
    'code': [
      { type: 'required', message: 'Code is required.' }
    ]
  };

  constructor(public router: Router, 
    private route: ActivatedRoute, 
    private uiServ: UiServiceService,
    private authServ: AuthServiceService,
    public translate: TranslateService
    ) { 
      this.route.queryParams.subscribe(params => {
        this.tipoLogin = params['tipoLogin'];
      });
    this.verifyForm = new FormGroup({
      'code': new FormControl('', Validators.required)
    });
  }

  async ngOnInit() {
    this.translate.onLangChange.subscribe(() => this.getTranslations());
  }
  
  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  doSignup(): void {
    this.uiServ.presentLoading();
    setTimeout(() => {
       const aux=Number.parseInt( this.verifyForm.value.code.toString());
       if (this.verificationCodes.some(x=> x==aux)){
         switch (this.tipoLogin) {
           case 'manual':
            let navigationExtras: NavigationExtras = {
              queryParams:{invitation_code: this.verifyForm.value.code.toString()}
            };
             this.uiServ.dismissLoading();
             this.router.navigate(['auth/signup'],navigationExtras);
             break;
          case 'ios':
          
          break;
          case 'google':
          
          break;
           default:
             break;
         }
       }
       else {
        this.uiServ.dismissLoading();
         this.uiServ.alertaInformativa('El código ingresado no es válido, comuniquese con el administrador de WeMoove');
       }
     }, 3000);
  }

  async doSocialMediaSignup(firstname,lastname, password,
    social_login_desc,email, invitation_code): Promise<void> {
    this.uiServ.presentLoading();
  
    console.log('save usr OK');
      await this.authServ.socialMediaSignup(firstname,lastname, password,password,'1',(password.toString()).substring(0,15),'true',
        social_login_desc, '11111111',null,null,null,email,invitation_code).then(async resp => {
          // await this.authServ.verifyEmail(resp['data']['code'], email);
        this.uiServ.dismissLoading();
          // this.uiServ.alertaGoRoute(`Gracias por registrarse, te enviaremos un mail con un codigo de verificación.`,'auth/verifyEmail');
        }
      ).catch(async rej => {
  
        this.uiServ.dismissLoading();
        // this.uiServ.alertaGoRoute(`Se produjo un problema al intentar guardar los datos. Error: ${rej['message']}`, 'auth/login');
      });
  }

  doLoginSocial(externalId): void {
    
    this.uiServ.presentLoading();
    this.authServ.socialLogin(externalId).then( async () => {
      this.uiServ.dismissLoading();
      this.router.navigate(['/activities']);
    })
    .catch(async rej => {
      this.uiServ.dismissLoading();
      if(rej?.message && rej.message =="Email not verified."){
        this.uiServ.alertaGoRoute(rej.message,'auth/verifyEmail')
      } else
        // this.uiServ.alertaInformativa(rej.message);
        this.uiServ.alertaInformativa('El usuario ya se encuentra registrado, intente ingresar utilizando mail y contraseña.');
    });
    
  }

  async signInApple(){

    let options: SignInWithAppleOptions = {
      clientId: 'com.wemoove.wemoove',
      redirectURI: '',
      scopes: 'email name',
      state: '12345',
      nonce: 'nonce',
    };
    SignInWithApple.authorize(options)
  .then((result: SignInWithAppleResponse) => {
    console.log('singup Apple',result);
    this.doSocialMediaSignup(result.response.givenName, result.response.familyName, result.response.user,'AppleAuth', result.response.email,this.verifyForm.value.code.toString()).then(()=>{
      this.doLoginSocial(result.response.user);
    }).catch(error => {
      this.uiServ.alertaInformativa(error);
      //this.uiServ.alertaInformativa('El usuario ya se encuentra registrado, intente ingresar utilizando mail y contraseña.');
    });
  })
  .catch(error => {
    // Handle error
    this.uiServ.alertaInformativa(error);
  });
  }
  
  async signInGoogle(){
    this.user = await GoogleAuth.signIn();
    this.doSocialMediaSignup(this.user.givenName, this.user.familyName, this.user.id,'GoogleAuth', this.user.email,this.verifyForm.value.code.toString()).then(()=>{
      this.doLoginSocial(this.user.id);
    }).catch(error => {
      this.uiServ.alertaInformativa('El usuario ya se encuentra registrado, intente ingresar utilizando mail y contraseña.');
  
      // this.uiServ.alertaInformativa(error);
    });
  
  }



}
