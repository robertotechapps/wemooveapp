import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AchievementModel } from '../../models/achievement.model';

@Component({
  selector: 'app-achievements-detail',
  templateUrl: './achievements-detail.page.html',
  styleUrls: ['./achievements-detail.page.scss'],
})
export class AchievementsDetailPage {

  achievement: AchievementModel= new AchievementModel();
  constructor(public alertController: AlertController, private route: ActivatedRoute, private router: Router) { 
    this.route.queryParams.subscribe(params=>{
      if (this.router.getCurrentNavigation().extras.state) {
        this.achievement =this.router.getCurrentNavigation().extras.state.achievement;
      }
    })
  }

  async compartir(){
    const alert = await this.alertController.create({
      header: "Compartir",
      message: "Este logro se compartira en tus redes",
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: "Aceptar",
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

}
