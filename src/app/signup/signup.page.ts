import { Component, OnInit, ViewChild, HostBinding, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, MenuController, IonRouterOutlet, IonSlides,AlertController, ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';

import { PasswordValidator } from '../validators/password.validator';

import { LanguageService } from '../language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { UiServiceService } from '../services/ui-service.service';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [
    './styles/signup.page.scss'
  ]
})
export class SignupPage implements OnInit {
  @ViewChild(IonSlides, {static: true}) slides: IonSlides;
  @HostBinding('class.last-slide-active') isLastSlide = false;
  translations;
  curSlide = 0;
  docTypes: Array<string>;

  signupForm: FormGroup;
  identity_verification_group: FormGroup;
  matching_passwords_group: FormGroup;
  public formData = new FormData();

  frontPhotoId: string='./assets/noImage.png';
  backPhotoId: string='./assets/noImage.png';
  selfiePhotoId: string='./assets/noImage.png';

  frontPhotoBase64: any;
  backPhotoBase64: any;
  selfiePhotoBase64: any;
  invitation_code:string;


  validation_messages = {
    'firstname': [
      { type: 'required', message: 'NOMBRE_REQUERIDO' }
    ],
    'lastname': [
      { type: 'required', message: 'APELLIDO_REQUERIDO' }
    ],
    'nro_doc': [
      { type: 'required', message: 'Doc number is required.' }
    ],
    'email': [
      { type: 'required', message: 'EMAIL_REQUERIDO' },
      { type: 'pattern', message: 'EMAIL_PATTERN' }
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

  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public fotoServ: PhotoService,
    public uiServ: UiServiceService,
    public authServ: AuthServiceService,
    public translate: TranslateService,
    public languageService: LanguageService,
    private route: ActivatedRoute, 
  ) {

    this.route.queryParams.subscribe(params => {
      this.invitation_code = params['invitation_code'];
    });

    this.docTypes = [
      'ID'
    ];

    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.identity_verification_group = new FormGroup({
      'doc_type': new FormControl(this.docTypes[0], Validators.required),
      'doc_number': new FormControl('', Validators.required)
    })

    this.signupForm = new FormGroup({
      'firstname': new FormControl('', Validators.required),
      'lastname': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'matching_passwords': this.matching_passwords_group
      ,
      'identity_verification': this.identity_verification_group
    });

    
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => this.getTranslations());
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
    this.resetForm();  
    this.menu.enable(true);
  }

  showTermsModal= async () => {
    window.open('https://www.demo.karmasoft.online/#/terms&conditions' );
  };

  async doSignup(): Promise<void> {

    let gusrdarOk=true;
    this.uiServ.presentLoading();

    // this.frontPhotoBase64 = this.fotoServ.savedFileFinal[0].data;
    // this.backPhotoBase64 = this.fotoServ.savedFileFinal[1].data;
    // this.selfiePhotoBase64 = this.fotoServ.savedFileFinal[2].data;


      const base64Data1 = this.fotoServ.savedFileFinal[0].data;
      const base64Response1 = await fetch(`data:image/jpeg;base64,${base64Data1}`);
      const blob1 = await base64Response1.blob();
      this.formData.append('pic_doc_front',blob1,this.fotoServ.savedFileFinal[0].path);
      
      const base64Data2 = this.fotoServ.savedFileFinal[1].data;
      const base64Response2 = await fetch(`data:image/jpeg;base64,${base64Data2}`);
      const blob2 = await base64Response2.blob();
      this.formData.append('pic_doc_back',blob2,this.fotoServ.savedFileFinal[1].path);
      
      const base64Data3 = this.fotoServ.savedFileFinal[2].data;
      const base64Response3 = await fetch(`data:image/jpeg;base64,${base64Data3}`);
      const blob3 = await base64Response3.blob();
      this.formData.append('selfie',blob3,this.fotoServ.savedFileFinal[2].path);


    this.formData.append('firstname',this.signupForm.value.firstname);
    this.formData.append('lastname',this.signupForm.value.lastname);
    this.formData.append('password',this.matching_passwords_group.value.password);
    this.formData.append('password_confirmation',this.matching_passwords_group.value.password,);
    this.formData.append('doc_type',this.identity_verification_group.value.doc_type);
    this.formData.append('doc_number',this.identity_verification_group.value.doc_number);
    this.formData.append('social_login','false');
    this.formData.append('social_login_desc','-');
    this.formData.append('email',this.signupForm.value.email);
    this.formData.append('cell','0');
    this.formData.append('invitation_code',this.invitation_code);

    if (gusrdarOk) {
      await this.authServ.signup(this.formData).then(async resp => {
    
        console.log('save usr OK',resp);
        this.uiServ.dismissLoading();
        
          this.uiServ.alertaGoRoute(`Gracias por registrarse, te enviaremos un mail con un codigo de verificación.`,'auth/verifyEmail');
          // this.uiServ.alertaGoRoute(`Gracias por registrarse.`,'auth/login');
        }
      ).catch(async rej => {

        this.uiServ.dismissLoading();
        this.uiServ.alertaGoRoute(`Se produjo un problema al intentar guardar los datos. Error: ${rej['message']}`, 'auth/login');
      });
    }


  }

  private resetForm() {
    this.curSlide = 0;
    this.slides.lockSwipes(false);
      this.slides.slideTo(this.curSlide);
      this.slides.lockSwipes(true);
    this.signupForm.reset();
    this.matching_passwords_group.reset();
    this.identity_verification_group.reset();
    this.fotoServ.resetFotos();
    this.frontPhotoId = './assets/noImage.png';
    this.selfiePhotoId = './assets/noImage.png';
    this.backPhotoId = './assets/noImage.png';
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.slides.lockSwipes(false);
      this.slides.slideTo(0);
      this.slides.lockSwipes(true);
  }

  continuar(){
    if(this.curSlide < 3){
      this.curSlide ++;
      this.slides.lockSwipes(false);
      this.slides.slideTo(this.curSlide);
      this.slides.lockSwipes(true);
    }
  }
  volver(){
    if(this.curSlide > 0){
      this.curSlide --;
      this.slides.lockSwipes(false);
      this.slides.slideTo(this.curSlide);
      this.slides.lockSwipes(true);
    } else {
      this.router.navigate(['getting-started']);
    }
    
  }

  async cargarFoto(tipoFoto: number)
  {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desde dónde desea subir la imagen?',
      buttons: [{
              text: 'Desde la galería',
              handler: async () => {
                  await this.fotoServ.addNewToGallery('PHOTOLIBRARY').then(resp=>{
                    console.log('Fotos',this.fotoServ.photos);
                    switch (tipoFoto) {
                      case 0:
                        this.frontPhotoId= this.fotoServ.photos[tipoFoto].webviewPath;
                        break;
                      case 1:
                        this.backPhotoId= this.fotoServ.photos[tipoFoto].webviewPath;
                        break;
                      case 2:
                        this.selfiePhotoId= this.fotoServ.photos[tipoFoto].webviewPath;
                        break;
                    
                      default:
                        break;
                    }
                  });
                }
              },
              {
                text: 'Usar la cámara',
                handler: async () => {
                await this.fotoServ.addNewToGallery('CAMERA').then(resp =>{
                  switch (tipoFoto) {
                    case 0:
                      this.frontPhotoId= this.fotoServ.photos[tipoFoto].webviewPath;
                      break;
                    case 1:
                      this.backPhotoId= this.fotoServ.photos[tipoFoto].webviewPath;
                      break;
                    case 2:
                      this.selfiePhotoId= this.fotoServ.photos[tipoFoto].webviewPath;
                      break;
                  
                    default:
                      break;
                  }
                })
              }
          },
          {
              text: 'Cancelar',
              role: 'cancel'
          }
      ]
    });
    await actionSheet.present();
  }
  
  // doFacebookSignup(): void {
  //   console.log('facebook signup');
  //   this.router.navigate(['app/activities']);
  // }

  // doGoogleSignup(): void {
  //   console.log('google signup');
  //   this.router.navigate(['app/activities']);
  // }

  // doTwitterSignup(): void {
  //   console.log('twitter signup');
  //   this.router.navigate(['app/activities']);
  // }

  // doAppleSignup(): void {
  //   console.log('apple signup');
  //   this.router.navigate(['app/activities']);
  // }

}
