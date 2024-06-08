import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDashboardModel, UserModel } from 'src/app/models/user-profile.model';
import { DataStore } from 'src/app/shell/data-store';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../language/language.service';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from '../../services/user.service';
import { UiServiceService } from '../../services/ui-service.service';
import { NgConditionsPipesModule } from 'angular-pipes';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: [
    './styles/user-profile.page.scss',
    './styles/user-profile.shell.scss',
    './styles/user-profile.ios.scss',
    './styles/user-profile.md.scss'
  ]
})
export class UserProfilePage implements OnInit, OnDestroy {

  stringTime:string='';
  totalDistancia: number=0;

  profile: UserDashboardModel= new UserDashboardModel();
  totAmountStateSubscription: Subscription;
  userStateSubscription: Subscription;

  translations;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private languajeService: LanguageService,
    public actionSheetController: ActionSheetController,
    public fotoServ: PhotoService,
    private usrService: UserService,
    private uiServ: UiServiceService
  ) { 
    this.userStateSubscription=this.usrService.userDetail$.subscribe( uc =>{
      this.profile.userDetail=uc;
      console.log('perfil',uc);
    });
    this.totAmountStateSubscription=this.usrService.userTotalAmount$.subscribe( uc =>{
      this.profile.totalAmounts=uc;
      if (this.profile.totalAmounts) {
        
        let seconds: any = this.profile.totalAmounts.totalTiempo % 60;
        let minutes: any = this.profile.totalAmounts.totalTiempo/60;
        let hours: any = minutes / 60;
  
        minutes= String('0'+ Math.floor(minutes)).slice(-2);
        seconds= String('0'+ Math.floor(seconds)).slice(-2);
        hours= String('0'+ Math.floor(hours)).slice(-2);
        console.log('distancia', this.profile.totalAmounts.totalDistancia) ;
        this.totalDistancia= Number.parseFloat( this.profile.totalAmounts.totalDistancia) * 0.001 ;
        this.stringTime= hours +':'+minutes+':'+seconds;
      }
    });
  }

  ngOnInit() {

    this.getTranslations();
    this.translate.onLangChange.subscribe(() => this.getTranslations());
  }

  ngOnDestroy(): void {
    this.userStateSubscription.unsubscribe();
    this.totAmountStateSubscription.unsubscribe();
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  async cargarAvatar()
  {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desde dónde desea subir la imagen?',
      buttons: [{
              text: 'Desde la galería',
              handler: async () => {
                  await this.fotoServ.saveNewToGallery('PHOTOLIBRARY').then(resp=>{
                    console.log('Fotos',this.fotoServ.photos);
                    // this.profile.avatar= this.fotoServ.photos[0].base64;
                    this.uiServ.presentLoading();
                    this.usrService.updateUserProfile(this.profile.userDetail.firstname, this.profile.userDetail.lastname, this.profile.userDetail.cell? this.profile.userDetail.cell:'0', this.fotoServ.photos[0].base64)
                    .then(() => {
                      this.uiServ.dismissLoading();
                    })
                    .catch( async rej => {
                      this.uiServ.dismissLoading();
                      this.uiServ.alertaInformativa(rej.message);
                    });

                  });
                }
              },
              {
                text: 'Usar la cámara',
                handler: async () => {
                await this.fotoServ.saveNewToGallery('CAMERA').then(resp =>{
                  // this.profile.avatar= this.fotoServ.photos[0].base64;
                  this.uiServ.presentLoading();
                  this.usrService.updateUserProfile(this.profile.userDetail.firstname, this.profile.userDetail.lastname, this.profile.userDetail.cell? this.profile.userDetail.cell:'0', this.fotoServ.photos[0].base64)
                  .then(() => {
                    this.uiServ.dismissLoading();
                  })
                  .catch( async rej => {
                    this.uiServ.dismissLoading();
                    this.uiServ.alertaInformativa(rej.message);
                  });
                  // this.avatarsrc = this.fotoServ.photos[0].webviewPath;
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

}
