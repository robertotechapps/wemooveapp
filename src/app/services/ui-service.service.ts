import { Injectable } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {
  
  isLoading= false;
  
  constructor(private alertController: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private navCtrl: NavController ) { }
  async alertaConfirmacion(message:string, urlYes:string, urlNo:string) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      // header: 'Alert',
      // subHeader: 'Subtitle',
      message,
      buttons: [{
        text:'ACEPTAR',
        handler: () => {
          this.navCtrl.navigateForward(urlYes) ;
        }
      }, {
        text:'CERRAR',
        handler: () => {
          this.navCtrl.navigateForward(urlNo) ;
        }
      }]
    });

    await alert.present();
  }

  async alertaInformativa( message: string) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      // header: 'Alert',
      // subHeader: 'Subtitle',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
  async alerta( title:string, message: string) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: title,
      // subHeader: 'Subtitle',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
  async alertaGoRoute( message: string, url:string) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      // header: 'Alert',
      // subHeader: 'Subtitle',
      message,
      buttons: [{
        text:'CERRAR',
        handler: () => {
          this.navCtrl.navigateForward(url) ;
        }
      }]
    });

    await alert.present();
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
       duration: 100000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
    }
  }

  async presentToastWithOptions(header: string, message: string) {
    const toast = await this.toastCtrl.create({
      header,
      message,
      position: 'bottom' ,
      duration: 4000,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
