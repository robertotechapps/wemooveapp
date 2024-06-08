import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityModel } from 'src/app/models/activity.model';
import { ActivityService } from 'src/app/services/activity.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.page.html',
  styleUrls: ['./activity-list.page.scss', ],
})
export class ActivityListPage implements OnInit {

  activityList: ActivityModel[];

  constructor(private router: Router,
    private actService: ActivityService, 
    public translate: TranslateService,
    private uiServ: UiServiceService) { 
    
  }

  async ngOnInit() {
    this.uiServ.presentLoading();
    await this.actService.getUserActivities().then((list) =>{
      console.log("ACTIVIDADES",list);
      this.activityList=list;
      this.uiServ.dismissLoading();
    });
  }
  

  async detalle(id: number){
    this.uiServ.presentLoading();
    this.actService.getUserActivity(id).then((activity)=>{

      let navigationExtras: NavigationExtras = {
        state: {
          activity: activity
        }
      };
      this.uiServ.dismissLoading();
      this.router.navigate(['/activity-detail'], navigationExtras);
    }
    );
  }

  public convertToStringTime(tiempo: string) {
    const totalSeconds=Math.round(Number.parseFloat(tiempo)*60);
    let seconds: any = totalSeconds % 60;
    let minutes: any = (totalSeconds / 60)%60;
    let hours: any = (totalSeconds / 60) / 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);
    hours = String('0' + Math.floor(hours)).slice(-2);

    return hours + ':' + minutes + ':' + seconds;
  }

  
  public convertToKms(distancia: string) {
    return Number.parseFloat(distancia) * 0.001;
  }
}
