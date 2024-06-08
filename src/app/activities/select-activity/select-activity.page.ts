import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDashboardModel, UserDetailModel } from '../../models/user-profile.model';
import { ActivityTypeModel } from '../../models/activity-type.model';
import { ActivityService } from '../../services/activity.service';
import { UiServiceService } from '../../services/ui-service.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { TodayTotalActivityModel, TodayActivityModel } from '../../models/activity.model';
import * as moment from 'moment';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { SelectCharityComponent } from 'src/app/components/select-charity/select-charity.component';
import { Chart, ChartItem, registerables } from 'chart.js';

Chart.register(...registerables)

@Component({
  selector: 'app-select-activity',
  templateUrl: './select-activity.page.html',
  styleUrls: [
    '../styles/select-activity.page.scss',
    '../styles/select-activity.shell.scss',
    '../styles/select-activity.responsive.scss'
  ]
})
export class SelectActivityPage implements OnInit, OnDestroy {

  @ViewChild('barChart') barChart: { nativeElement: ChartItem; };
  bars: any;
  colorArray: any;
  
  segment=0;
  usrDashboard: UserDashboardModel= new UserDashboardModel();
  usrDetail: UserDetailModel = new UserDetailModel();
  todayTotalActivity: TodayTotalActivityModel;
  activity_types: Array<ActivityTypeModel>;

  userStateSubscription: Subscription;
  activityTypeStateSubscription: Subscription;
  todayTotalActivityStateSubscription: Subscription;
  userCharitySubscription: Subscription;
  userChallengeSubscription: Subscription;
  totAmountStateSubscription: Subscription;

  translations;
  isLoading:boolean=true;

  colorList = ['#da14f5','#c1508c', '#f7a430', '#290baf', '#004d6a','#004d6a']

  activityChart:Array<{activityIcon:string, activityId:number,activityName:string, activityCalories:number} >= [];
  
  todayTotalActivityOk: boolean=false;
  loaderStarted: boolean=true;

  constructor(
              private usrService: UserService,
              private activityService: ActivityService, 
              private uiServ: UiServiceService,   
              public translate: TranslateService,
              private router: Router,
              private modalController: ModalController,
              public routerOutlet: IonRouterOutlet) {

              this.userChallengeSubscription=this.usrService.userChallenge$.subscribe( uc =>{
                this.usrDashboard.currentChallenge=uc;
                this.checkLoad();
              });
              this.userCharitySubscription=this.usrService.userCharity$.subscribe( uc =>{
                this.usrDashboard.charity=uc;
                this.checkLoad();
              });
              this.userStateSubscription=this.usrService.userDetail$.subscribe( uc =>{
                if(uc && uc.id){
                  this.usrDashboard.userDetail=uc;
                  if(!(this.usrDashboard.userDetail 
                    && this.usrDashboard.userDetail.sex 
                    && this.usrDashboard.userDetail.entity_id 
                    && this.usrDashboard.userDetail.height 
                    && this.usrDashboard.userDetail.weight)){
                    this.uiServ.dismissLoading();
                    this.router.navigate(['/walkthrough']);
                  }
                  else
                    this.checkLoad();
                }
              });
              this.totAmountStateSubscription=this.usrService.userTotalAmount$.subscribe( uc =>{
                this.usrDashboard.totalAmounts=uc;
                this.checkLoad();
              });
              this.todayTotalActivityStateSubscription=this.usrService.todayTotalActivity$.subscribe( uc =>{
                if (uc) {
                  let auxArray=[];
                  this.todayTotalActivity = uc;
                  console.log(uc);
  
                  this.todayTotalActivity.activityList.forEach( (x:TodayActivityModel) => {
                    const auxEl=auxArray.find(act=> {act.activityId == x.activity_type_id});
                    if(auxEl)
                    {
                      const auxIdx = auxArray.indexOf(auxEl);
                      auxArray[auxIdx].activityCalories += x.total_calories;
                    } else
                      auxArray.push({
                        activityIcon: x.icon, activityId:x.activity_type_id,activityName:x.activity_type_name, activityCalories:x.total_calories
                      });
                  });
                  
                  auxArray=auxArray.sort((a,b)=> a.total_calories-b.total_calories);
                  if(auxArray != this.activityChart){
                    this.activityChart=[];
                  }
                  auxArray.forEach(x =>{
                    if(this.activityChart.length <=4)
                      this.activityChart.push(x);
                    else{
                      this.activityChart[3].activityName='Otras';
                      this.activityChart[3].activityCalories += x.activityCalories;
                    }

                  })
                  this.todayTotalActivityOk=true;
                  this.checkLoad();
                }
              });
              this.activityTypeStateSubscription=this.activityService.activityTypeList$.subscribe(at =>{
                this.activity_types=at;
                this.checkLoad();
              })
  }

  ngOnDestroy(): void {
    this.userStateSubscription.unsubscribe();
    this.activityTypeStateSubscription.unsubscribe();
    this.todayTotalActivityStateSubscription.unsubscribe();
    this.userChallengeSubscription.unsubscribe();
    this.userCharitySubscription.unsubscribe();
    this.totAmountStateSubscription.unsubscribe();
  }

  async ngOnInit(){
  this.isLoading=true;

    this.getTranslations();

    if (Capacitor.getPlatform() != 'web') {
      //NOTIFICATIONS
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        //this.usrServ.sendNotifToken(token);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          //this.refrescarDatos();
          console.log('Push received: ' + JSON.stringify(notification));
          const notif =JSON.stringify(notification);
          this.uiServ.alerta(notif['title'],notif['body']);
        },
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          //this.refrescarDatos();
          PushNotifications.removeAllDeliveredNotifications();
          console.log('Push action performed: ' + JSON.stringify(notification));
        },
      );
    }
  }

  checkLoad(){
    this.isLoading= (this.usrDashboard.charity && !this.usrDashboard.charity.queried )
                    || (this.usrDashboard.currentChallenge && !this.usrDashboard.currentChallenge.queried)
                    // || !this.usrDashboard.totalAmounts
                    || (this.usrDashboard.userDetail && this.usrDashboard.userDetail.id==0)
                    || !this.todayTotalActivityOk
                    || !this.activity_types;
    console.log('isloading',this.isLoading)
    // if (this.isLoading && !this.loaderStarted) {
    //   this.uiServ.presentLoading();
    //   this.loaderStarted=false;
    // } 
    if (!this.isLoading){
      setTimeout(() => {
        
        this.createBarChart();
      }, 1000);
    }
  }
  
  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    if(ev.detail.value == 'all')
    {
      this.segment=0;
    } else {
      this.segment=1;
    }
  }

  verDesafio(){
    if (this.usrDashboard.currentChallenge) {
      
      let navigationExtras: NavigationExtras = {
        state: {
          challengeId: this.usrDashboard.currentChallenge.challenge.id
        }
      };
      this.router.navigate(['/challenge-detail'], navigationExtras);
    } else
      this.selectChallenge();
  }
  
  async iniciarActividad(id: number){
    let navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usrDashboard.userDetail,
        charity: this.usrDashboard.charity,
        challenge: this.usrDashboard.currentChallenge.challenge,
        activityType: this.activity_types.find( x=> x.id == id)
      }
    };
    this.router.navigate(['/activity-in-progress'], navigationExtras);
  }

  async selectChallenge(){
   // await this.challengeServ.getChallengeList('available');
    this.router.navigate(['/challenges']);
  }

  async cambiarEntidad(){
    const modal = await this.modalController.create({
      component: SelectCharityComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    modal.onDidDismiss()
      .then((data) => {
        if (data.data) {
          
          this.uiServ.presentLoading();
  
          this.usrService.updateUser(this.usrDashboard.userDetail.sex, 
                                    this.usrDashboard.userDetail.weight,
                                    this.usrDashboard.userDetail.height,
                                    data.data['id'],
                                    moment.utc(this.usrDashboard.userDetail.birth_date).format('YYYY-MM-DD'),
                                    this.usrDashboard.userDetail.lenguage,
                                    this.usrDashboard.userDetail.country,
                                    this.usrDashboard.userDetail.measure_unit
                                    ).then( () => {
              // this.usrService.getUsrDetail();
            this.uiServ.dismissLoading();
          })
              .catch(async rej => {
            this.uiServ.dismissLoading();
              this.uiServ.alertaInformativa(rej.message);
          });
        }
    });

    return await modal.present();

  }

  // ionViewDidEnter() {
  //   if(!this.isLoading)
  //     this.createBarChart();
  // }

  createBarChart() {
    if (this.bars) {
        this.bars.destroy();
    }
    const colors: Array<{backgroundColor: string,borderColor:string}> = [{
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)'
    },
    {
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)'
    },
    {
      backgroundColor: 'rgba(54, 162, 235, 1)',
      borderColor: 'rgba(255, 206, 86, 1)'
    },
    {
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)'
    }
  ]
    let chartDataSets=[];
    this.activityChart.forEach((ac, index) =>{
      chartDataSets.push({
        label: ac.activityName,
            data: [ ac.activityCalories],
            backgroundColor: colors[index].backgroundColor,
            borderColor: colors[index].borderColor,
            borderWidth: 1
      })
    })

    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Cal'],
        datasets: chartDataSets
    },
    options: {
      indexAxis: 'y',
      responsive: true,
        scales: {
          x: {
            stacked: true,
          },
            y: {
                beginAtZero: true,
                stacked: true
            }
        }
    }
    });
  }

}

