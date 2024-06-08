import { Component, OnDestroy } from '@angular/core';
 import { SplashScreen } from '@capacitor/splash-screen';
 import { TranslateService } from '@ngx-translate/core';
 import { HistoryHelperService } from './utils/history-helper.service';
 import { UserDetailModel, UserModel } from './models/user-profile.model';
 import { ChallengeService } from './services/challenge.service';
 import { UserService } from './services/user.service';
 import { Subscription } from 'rxjs';
 import { Device } from '@capacitor/device';
 import { ModalController, NavController, AlertController } from '@ionic/angular';
 import { SelectCharityComponent } from './components/select-charity/select-charity.component';
 import { UiServiceService } from './services/ui-service.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthServiceService } from './services/auth-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    './side-menu/styles/side-menu.scss',
    './side-menu/styles/side-menu.shell.scss',
     './side-menu/styles/side-menu.responsive.scss'
   ],
 })
 export class AppComponent implements OnDestroy {
  usrLogueado: UserDetailModel;
   appPages = [
     {
      title: 'DASHBOARD',
      url: '/activities',
      ionicIcon: 'apps-outline'
    },
    {
      title: 'MI_PERFIL',
      url: '/user-profile',
      ionicIcon: 'person-outline'
    }
  ];
  accountPages = [
    {
      title: 'MIS_ACTIVIDADES',
      url: '/my-activities',
      ionicIcon: 'walk'
    },
    {
      title: 'MIS_DESAFIOS',
      url: '/challenges-user',
      ionicIcon: 'golf-outline'
    },
    {
      title: 'ENTIDADES_BENEFICAS',
      url: 'entities',
      ionicIcon: 'golf-outline'
    },
    {
      title: 'BILLETERA',
      url: '/wallet',
      ionicIcon: 'wallet-outline'
    },
    {
      title: 'CONFIGURACION',
      url: '/config',
      ionicIcon: 'settings-outline'
    },
    {
      title: 'LOGOUT',
      url: 'logout',
      ionicIcon:'log-out-outline'
    },
    {
      title: 'REMOVE',
      url: 'deleteMyAccount',
      ionicIcon:'trash-outline'
    }
   ];

   textDir = 'ltr';
   stateSubscription: Subscription;
   translations;
   avatarsrc: string;
   // Inject HistoryHelperService in the app.components.ts so its available app-wide
   constructor(
     public translate: TranslateService,private router: Router,
     public chaService: ChallengeService, public usrService: UserService,
     public historyHelper: HistoryHelperService,  
     private uiServ: UiServiceService,
     private modalController: ModalController,private alertController: AlertController,
     private authServ: AuthServiceService
     ) {
      this.setLanguage('en');
      this.initializeApp();
    }
    ngOnDestroy(): void {
      if(this.stateSubscription)
        this.stateSubscription.unsubscribe();
    }
 
 
    async initializeApp() {
      try {
       await SplashScreen.hide();
        this.stateSubscription = this.usrService.userDetail$.subscribe(resp=>{
          if (resp)
          {
            console.log('1 se actualizo el usuario logueado');
             this.usrLogueado=resp;
             this.avatarsrc = this.usrLogueado.avatar;
             if (!this.usrLogueado.lenguage) {
              Device.getLanguageCode().then(code=>{
                this.setLanguage(code.value.split('-')[0]);
                this.getTranslations();
              });
             } else {
               this.setLanguage(this.usrLogueado.lenguage);
               this.getTranslations();
             }
           }
           else {
             this.avatarsrc =  "../../assets/img/icon.png";
             Device.getLanguageCode().then(code=>{
              this.setLanguage(code.value.split('-')[0]);
              this.getTranslations();
            });
          }
         })
      
      } catch (err) {
       console.log('This is normal in a browser', err);
      }
   }
   getTranslations() {
     // get translations for this page to use in the Language Chooser Alert
     this.translate.getTranslation(this.translate.currentLang)
     .subscribe((translations) => this.translations = translations);
   }
   async onClick(url:string){
     switch (url) {
       case '/challenges-user':
         this.router.navigate([url]);
         break;
       case 'entities':
         this.openEntidadModal();
         break;
       case 'logout':
         this.cerrarSesion();
         break;
       case 'deleteMyAccount':
         this.eliminarCuenta();
         break;
       default:
         this.router.navigate([url]);
         break;
     }
   }
   onMenuClicked(url:string){
     this.router.navigate([url]).then(() => {
       window.location.reload();
     });
   }
   setLanguage(lang: string) {
     this.translate.setDefaultLang('en');
     this.translate.use(lang);
   }
   async openEntidadModal() {
     const modal = await this.modalController.create({
       component: SelectCharityComponent,
       canDismiss: true,
       componentProps  : {propsType : 'modal'},
     });
     modal.onDidDismiss()
       .then((data) => {
         if (data.data) {
           this.uiServ.presentLoading();
           this.usrService.updateUser(this.usrLogueado.sex, 
             this.usrLogueado.weight,
             this.usrLogueado.height,
             data.data['id'],
             moment(this.usrLogueado.birth_date).format('YYYY-MM-DD'),this.usrLogueado.lenguage,
             this.usrLogueado.country,
             this.usrLogueado.measure_unit).then( () => {
               //navegar
               this.uiServ.dismissLoading();
               });
         }
     });
     return await modal.present();
   }

   async eliminarCuenta(){
    const message:string=this.translate.currentLang == 'es'? 'Está seguro de que desea eliminar su cuenta?':
                                                             'Are you sure you want to delete your account?';
    const alert = await this.alertController.create({
      message,
      buttons: [{
        text: this.translate.currentLang == 'es'? 'ACEPTAR': 'ACCEPT',
        handler: () => {
          this.uiServ.presentLoading();
          this.usrService.logOutUser();
          this.authServ.deleteAccount().then(()=>{
            this.uiServ.dismissLoading();
            this.router.navigate(['getting-started']);
          })
          .catch(() => {
            this.uiServ.dismissLoading();
            this.router.navigate(['getting-started']);
          });
        }
      }, {
        text:this.translate.currentLang == 'es'? 'CANCELAR': 'CANCEL',
        handler: () => {
        }
      }]
    });
    await alert.present();
    
  }

  cerrarSesion(){
    this.uiServ.presentLoading();
    this.usrService.logOutUser();
    this.authServ.logout().then(()=>{
      this.uiServ.dismissLoading();
      this.router.navigate(['getting-started']);
    });
  }
 }
