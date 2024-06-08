import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { UiServiceService } from '../../services/ui-service.service';
import { ActivityModel, ActivityTotalModel } from '../../models/activity.model';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables)

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.page.html',
  styleUrls: ['./my-activities.page.scss'],
})
export class MyActivitiesPage implements OnInit {

  @ViewChild('barChart') barChart;

  bars: any;
  colorArray: any;
  
  activityList: ActivityModel[];
  activityTotalList: ActivityTotalModel[];
  translations;
  lastActivity:ActivityModel=new ActivityModel();
  kilometros=0;
  totalCalorias=0;
  totalTiempo=0;
  stringTime:string='00:00:00';
  lastActivityStrTime:string='00:00:00';
  periodoConsultado: string='weekly';

  constructor(private actService: ActivityService, private uiServ: UiServiceService,
              public usrService: UserService, public translate: TranslateService) { 
    this.getActivities('semana');
    this.getLastUserActivity();
  }

  async ngOnInit() {
    this.getTranslations();
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  async segmentChanged(ev)
  {
    await this.getActivities(ev.detail.value);
  }

  private async getActivities(ev: string) {
    this.uiServ.presentLoading();
    let filter: string = '';
    let chartTitle: string='';
    switch (ev) {
      case 'semana':
        filter = this.periodoConsultado = 'weekly';
        chartTitle = 'THIS WEEK';
        break;
      case 'mes':
        filter =this.periodoConsultado = 'monthly';
        chartTitle = 'THIS MONTH';
        break;
      case 'anio':
        filter = this.periodoConsultado ='yearly';
        chartTitle = 'THIS YEAR';
        break;
      case 'all':
        filter = this.periodoConsultado ='total';
        chartTitle = 'ALL';
        break;

      default:
        break;
    }
  /*   await this.actService.getUserActivities(filter).then((list) => {

     if (this.activityList) {
        this.activityList.splice(0, this.activityList.length);
      }
      this.activityList = [...list.sort((a, b) => b.id - a.id)];
   //   this.lastActivity = this.activityList[0];
    }).catch((err)=>{ 
      this.uiServ.dismissLoading();
      this.uiServ.alertaInformativa(err)
    });
    */
    await this.actService.getActivityTotalList(filter).then((list) => {
      this.kilometros =0;
      this.totalCalorias =0;
      this.totalTiempo=0;

    /*  if (this.activityTotalList) {
        this.activityList.splice(0, this.activityTotalList.length);
      }
*/
      this.activityTotalList = list;
      this.activityTotalList.forEach((a)=>{
        this.totalCalorias += a.totals.total_calories;
        this.kilometros += a.totals.total_distance;
        this.totalTiempo += a.totals.total_duration;
      })
      if (this.kilometros>0) {
        this.kilometros = Math.round((this.kilometros*0.001)*100)/100;
      }

    //  this.createBarChart(chartTitle);
      this.uiServ.dismissLoading();
    }).catch((err)=>{ 
      this.uiServ.dismissLoading();
      this.uiServ.alertaInformativa(err)
    });
  }

  private async getLastUserActivity() {
    
    await this.actService.getLastUserActivity().then((list) => {
      this.lastActivity = list;
      console.log('LAST ACTIVITY',this.lastActivity)
      
    }).catch((err)=>{ 
      this.uiServ.dismissLoading();
      this.uiServ.alertaInformativa(err)
    });
  }

  public convertToStringTime(tiempo: string) {
    let seconds: any = (parseFloat(tiempo)*60) % 60;
    let minutes: any = (parseFloat(tiempo)) % 60;
    let hours: any = (parseFloat(tiempo)) / 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);
    hours = String('0' + Math.floor(hours)).slice(-2);

    return hours + ':' + minutes + ':' + seconds;
  }

  public convertToStringTimeNumber(tiempo: number) {
    let seconds: any = (tiempo*60) % 60;
    let minutes: any = (tiempo) % 60;
    let hours: any = (tiempo) / 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);
    hours = String('0' + Math.floor(hours)).slice(-2);

    return hours + ':' + minutes + ':' + seconds;
  }
  // ionViewDidEnter() {
  //   this.createBarChart("THIS WEEK");
  // }

  createBarChart(chartTitle: string) {
    if (this.bars) {
        this.bars.destroy();
    }
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [...this.activityTotalList.map((x)=> x.name)],
        datasets: [{
          label: 'Calories',
          data: [...this.activityTotalList.map((x)=> x.totals.total_calories)],
          backgroundColor: '#99FFFF99', // array should have same number of elements as number of dataset
          borderColor: '#FFF',// array should have same number of elements as number of dataset
          // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness:50
        }]
      },
      options: {
        scales: {
          x:{
            stacked: true,
            ticks:{
              color:'#FFF'
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks:{
              color:'#FFF'
            }
        }
        },
        plugins: {
          title: {
              display: true,
              text: chartTitle,
              color:"#FFF"
          },
          legend: {
            labels: {
                // This more specific font property overrides the global property
                color: '#FFF',
                font: {
                    size: 14
                }
            }
        }
        }
      }
    });
  }
}
