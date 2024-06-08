import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UiServiceService } from '../services/ui-service.service';
import { AuthServiceService } from '../services/auth-service.service';
import { AboutPage } from '../about/about.page';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage {
  
  unidadesMedida: Array<{name:string, code:string}>;
  paises: Array<string>;
  idiomas: Array<{name:string, code:string}>;
  usrLang: string='en';
  usrCountry: string= 'Sudamérica';
  usrMeasureUnit:string='1';
  translations;
  idioma: string;
  
  constructor(private modalController: ModalController, private alertController: AlertController,
    private routerOutlet: IonRouterOutlet, private router: Router, private uiServ: UiServiceService,
    private authServ: AuthServiceService,public translate: TranslateService, private usrService: UserService
    ) { 

    this.unidadesMedida = [
      {name:'Imperial', code:'1'},
      {name:'Métrico', code:'2'}
    ];

    this.paises = [
      'Centroamérica',
      'Norteamérica',
      'Sudamérica'
    ]

    this.idiomas = [{name:'Inglés', code: 'en'}, {name:'Español', code: 'es'}]
      this.usrLang= this.usrService.usuarioDetail.lenguage;
      this.usrCountry = this.usrService.usuarioDetail.country;
      this.usrMeasureUnit = this.usrService.usuarioDetail.measure_unit;
  }

  cerrarSesion(){
    this.uiServ.presentLoading();
    this.usrService.logOutUser();
    this.authServ.logout().then(()=>{
      this.uiServ.dismissLoading();
      this.router.navigate(['getting-started']);
    });
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


  showTermsPage = async () => {
    window.open('https://www.demo.karmasoft.online/#/terms&conditions' );
  };

  showPrivacyPage = async () => {
    window.open('https://www.demo.karmasoft.online/#/privacypolicy' );
  };

  async showAboutModal() {
    const modal = await this.modalController.create({
      component: AboutPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  configUserData(){
    this.router.navigate(['/walkthrough']);
  }

  ok(event:any){
    this.uiServ.presentLoading();
    this.usrService.updateUser( this.usrService.usuarioDetail.sex,
                                this.usrService.usuarioDetail.weight,
                                this.usrService.usuarioDetail.height,
                                this.usrService.usuarioDetail.entity_id,
                                moment.utc(this.usrService.usuarioDetail.birth_date).format('YYYY-MM-DD'),
                                event.detail.value,
                                this.usrService.usuarioDetail.country,
                                this.usrService.usuarioDetail.measure_unit
                                ).then(()=> {
                                  this.uiServ.dismissLoading()});
  }

  okCountry(event:any){
    this.uiServ.presentLoading();
    this.usrService.updateUser( this.usrService.usuarioDetail.sex,
                                this.usrService.usuarioDetail.weight,
                                this.usrService.usuarioDetail.height,
                                this.usrService.usuarioDetail.entity_id,
                                moment.utc(this.usrService.usuarioDetail.birth_date).format('YYYY-MM-DD'),
                                this.usrService.usuarioDetail.lenguage,
                                event.detail.value,
                                this.usrService.usuarioDetail.measure_unit
                                ).then(()=> {
                                  this.uiServ.dismissLoading()});
  }

  okMeasureUnit(event:any){
    this.uiServ.presentLoading();
    this.usrService.updateUser( this.usrService.usuarioDetail.sex,
                                this.usrService.usuarioDetail.weight,
                                this.usrService.usuarioDetail.height,
                                this.usrService.usuarioDetail.entity_id,
                                moment.utc(this.usrService.usuarioDetail.birth_date).format('YYYY-MM-DD'),
                                this.usrService.usuarioDetail.lenguage,
                                this.usrService.usuarioDetail.country,
                                event.detail.value).then(()=> {
                                  this.uiServ.dismissLoading()});
  }

}
