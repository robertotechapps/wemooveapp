import { Component, ElementRef, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { IonSlides, LoadingController, Platform, ModalController, AlertController } from '@ionic/angular';
import { LanguageService } from '../../language/language.service';
import { Geolocation } from '@capacitor/geolocation';
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ActivityTypeModel } from '../../models/activity-type.model';
import { ActivityService } from '../../services/activity.service';
import { UiServiceService } from '../../services/ui-service.service';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@awesome-cordova-plugins/device-motion/ngx';
import { CountDownCompComponent } from './count-down-comp/count-down-comp.component';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { UserDetailModel } from 'src/app/models/user-profile.model';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { UserChallengeModel } from 'src/app/models/challenge.model';
import { UserCharityModel } from '../../models/charity.model';
import { registerPlugin } from '@capacitor/core';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';

declare var google;
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

@Component({
  selector: 'app-activity-in-progress',
  templateUrl: './activity-in-progress.page.html',
  styleUrls: ['./activity-in-progress.page.scss'],
})
export class ActivityInProgressPage {

  @ViewChild(IonSlides, {static:true}) slides: IonSlides;
  @ViewChild('map') mapElement: ElementRef;

  map: any;
  currentMapTrack = null;
  isTracking = false;
  trackedRoute = [];
  callbackId: string;
  translations;
  canLoadMap= false;
  momentControl=0;

  public $mapReady: EventEmitter<any> = new EventEmitter();

  public _mapIdledOnce = false;
  startDate=  new Date(Date.now());
  startDateTimer: Date;
  parcialTime: number=0;

  time: string='00:00:00.000' ;
  timer: number =0;
  interval;

  calorias: BehaviorSubject<string> = new BehaviorSubject('0') ;
  kilometros: BehaviorSubject<string> = new BehaviorSubject('0') ;
  metros: number=0;

  accAnteriorY: number=null;
  distancia: number=0;
  distanciaAnterior: number=0;
  velocidadInicial: number=0;

  usrPeso:number=0;
  met: number=0;

  activity: ActivityTypeModel = new ActivityTypeModel();
  activityStatus: number=0;
  hasChallenge: boolean;
  icon: string;
  subscription: Subscription;
  usrLogueado: UserDetailModel;
  challenge: UserChallengeModel;
  charity: UserCharityModel;
  userStateSubscription: Subscription;
  marker:any;
  redrawMap: NodeJS.Timeout;
  watcherId:any;
  header:string;
  hasHeader:boolean;
    // modificacion dia 11/04/2024 agregado de funcionaledades
  // Variables for auto pause functionality
  inactiveTime: number = 0;
  motionSensorSubscription: Subscription;
  initialLatitude: number; // Define this variable with initial latitude
  initialLongitude: number; // Define this variable with initial longitude
  constructor(
    public languageService: LanguageService, public translate: TranslateService,
    public loadingController: LoadingController,
    public route: ActivatedRoute, private alertController: AlertController,
    private uiServ:UiServiceService,private router: Router,
    private activityServ: ActivityService, private plt: Platform,
    private deviceMotion: DeviceMotion, private modalController: ModalController,
    private vibration: Vibration,
    private backgroundMode: BackgroundMode
  ) {

    this.hasChallenge = false;
    this.hasHeader = false;
    this.icon = './assets/img/icon.png';
    this.route.queryParams.subscribe(params=>{
      if (this.router.getCurrentNavigation().extras.state) {
        this.activity =this.router.getCurrentNavigation().extras.state.activityType;
        this.usrLogueado =this.router.getCurrentNavigation().extras.state.usuario;
        this.usrPeso = this.usrLogueado.weight;
        this.charity =this.router.getCurrentNavigation().extras.state.charity;
        this.challenge = this.router.getCurrentNavigation().extras.state.challenge;
        if (this.challenge && this.challenge.challenge_id>0) {
          this.hasChallenge = true;
          if(this.challenge.challenge.header_color != '')
          {
            this.header = this.challenge.challenge.header_color;
            this.hasHeader = true;
          }

        }
        if (this.canLoadMap && this.activity && this.activity.map) {
          this.canLoadMap=false;
          this.initMap();
        }
      // modificacion dia 11/04/2024 agregado de funcionalidades
      // Call methods to start auto pause functionalities
        this.startMotionSensor();
        this.monitorUserLocation();
      }
    })


  }
      // modificacion dia 11/04/2024 agregado de funcionalidades
  private startMotionSensor() {
    const motionOptions: DeviceMotionAccelerometerOptions = {
      frequency: 1000
    };
    this.motionSensorSubscription = this.deviceMotion.watchAcceleration(motionOptions).subscribe((acc: DeviceMotionAccelerationData) => {
      console.log('Acceleration data:', acc); // Registro de los datos de aceleración para depuración

      // Calcular la norma de la aceleración
      const accelerationNorm = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);

      // Ajustar el umbral de sensibilidad
       const threshold = 1.0; // Ajusta este valor según tus necesidades
        // Verificar si la norma de la aceleración es menor que el umbral
        if (accelerationNorm < threshold) {
            this.inactiveTime += 1000;
            console.log('Inactive time:', this.inactiveTime);

        console.log('Inactive time:', this.inactiveTime); // Registro del tiempo de inactividad para depuración
        if (this.inactiveTime >= 60000) { // 5 minutos en milisegundos
          console.log('Pausing tracking due to inactivity...'); // Registro para verificar si se llama a la pausa debido a la inactividad
          this.pauseTracking();
        }
      } else {
        this.inactiveTime = 0;
      }
    });
  }

      // modificacion dia 11/04/2024 agregado de funcionalidades

  private monitorUserLocation() {
    const watchOptions = {
      enableHighAccuracy: true
    };
    const watchId = Geolocation.watchPosition(watchOptions, (position, err) => {
      if (err) {
        console.error('Error al obtener la ubicación:', err);
        return;
      }
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        new google.maps.LatLng(this.initialLatitude, this.initialLongitude)
      );
      if (distance > 100) { // 100 meters
        this.pauseTracking();

      }
    });
  }
        // modificacion dia 11/04/2024 agregado de funcionalidades
   async pauseTrackingDueToInactivity() {
    const alert = await this.alertController.create({
      message: 'Sigues realizando Actividad?.',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          // Lógica para continuar la actividad
          this.startTimer();
        }
      },
      {
        text: 'Terminar',
        handler: () => {
          // Lógica para finalizar la actividad
          this.stopTracking(); // Método para finalizar la actividad
        }
      }
    ]
  });
  await alert.present();
}
      // modificacion dia 11/04/2024 agregado de funcionalidades
  async pauseTrackingDueToDistance() {
    const alert = await this.alertController.create({
      message: 'Te alejaste de la zona de entrenamiento, ¿Sigues en Actividad?.',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          // Lógica para continuar la actividad
          this.startTimer();
        }
      },
      {
        text: 'Terminar',
        handler: () => {
          // Lógica para finalizar la actividad
          this.stopTracking(); // Método para finalizar la actividad
        }
      }
    ]
  });
  await alert.present();
}
  async onGoBack(){
    if ((this.timer/1000)>0) {
      const alert = await this.alertController.create({
        message:'Desea guardar la actividad?',
        buttons: [{
          text:'ACEPTAR',
          handler: () => {
            this.stopTracking();
          }
        }, {
          text:'CANCELAR',
          handler: () => {
            if (this.subscription) {

              this.subscription.unsubscribe();
            }

            BackgroundGeolocation.removeWatcher({id: this.watcherId});
            // if(this.backgroundMode.isActive())
            //   this.backgroundMode.disable();

            this.router.navigate(['/activities']);
          }
        }]
      });

      await alert.present();
    } else
      this.router.navigate(['/activities']);
  }

  ionViewDidEnter(){
    this.plt.ready().then(()=>{
      this.canLoadMap=true;
      if (this.activity && this.activity.map) {
        this.canLoadMap=false;
        this.initMap();
      }
    })

    this.getTranslations();
  }

  private initMap() {
    let mapOptions: google.maps.MapOptions = {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.setCenter(latLng);
      this.map.setZoom(16);

      if(this.hasChallenge)
      {
        //si es branded debe mostrar el picture con tamaño de iconMap
       var image = {
          url: this.challenge?.challenge.picture_url + "/" + this.challenge?.challenge.picture //"./assets/img/iconMap_2.png"
        };

      }else{
        var image = {
          url: "./assets/img/iconMap_2.png"
        };
      }

      this.marker = new google.maps.Marker({
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: position.coords.latitude, lng: position.coords.longitude },
        icon: image,
      });
    });
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  async startTracking() {
    this.activityStatus=1;
    const modal = await this.modalController.create({
      component: CountDownCompComponent
    });
    this.startDate= new Date(Date.now());
    modal.onDidDismiss()
      .then(() => {
        this.vibration.vibrate(1000);
        this.isTracking = true;
        this.trackedRoute = [];
        this.startTimer();
    });

    return await modal.present();
  }

  async startTimer(){
    this.startDateTimer= new Date(Date.now());

    this.interval = setInterval(async ()=>{
      this.updateTimeValue();

    }, 1);

    if (this.activity.map) {
        this.motionSense();
    } else {
        // if(!this.backgroundMode.isActive())
        //   this.backgroundMode.enable();
        this.motionSenseFijo();
    }
  }

  private async motionSenseFijo() {
    var options: DeviceMotionAccelerometerOptions = {
      frequency: 3000
    };

    this.subscription = this.deviceMotion.watchAcceleration(options).subscribe((acc: DeviceMotionAccelerationData) => {
      console.log("aceleracion", Math.trunc(acc.y) );
      console.log('se movio Y', acc.y )
      console.log('se movio X', acc.x )
      console.log('se movio Z', acc.z )
      // this.kilometros.next(this.momentControl.toString());
      if(Math.trunc(acc.y) ==0 || Math.trunc(acc.x)==0)
      {
        // this.parcialTime + moment(new Date(Date.now())).diff(this.startDateTimer,'milliseconds');
        // if(!this.momentControl)
        //   this.momentControl= moment(new Date(Date.now()));
        // console.log('diferencia:',moment(new Date(Date.now())).diff(this.momentControl,'minutes'));
        this.momentControl +=1;
        if(this.momentControl >=40)
            {
              console.log('actividad frenada', acc.y )
              this.pauseTracking();
            }
      } else {
        this.momentControl=0;
      }
      // calculo de distancia: d = Vi.t+1/2.a.t^2
      if (this.activity.id == 17 ) {
        if (this.accAnteriorY == null) {
          this.accAnteriorY = acc.y;
          this.distanciaAnterior = (1/2)*Math.abs(acc.y)*9;
          this.velocidadInicial = this.distanciaAnterior/3;
        } else {
          this.distanciaAnterior = this.velocidadInicial*3+(1/2)*Math.abs(acc.y)*9;
          this.velocidadInicial = this.distanciaAnterior/3;
        }
        this.distancia += this.distanciaAnterior;
        const mtsToKm = this.roundNumber(this.distancia * 0.001, 100);
        this.kilometros.next(mtsToKm.toString());
      }
      //this.distancia += this.distanciaAnterior;
      //ajuste por coeficiente de activity type si lo trae
      // if(this.activity.coefficient != 0)
      //   this.distancia += (this.distancia * this.activity.coefficient)/100;
      // const mtsToKm = this.roundNumber(this.distancia * 0.001, 100);
      // this.kilometros.next(mtsToKm.toString());
    });
  }

  pauseTracking() {
    this.isTracking = !this.isTracking;
    if (!this.isTracking) {
      if (this.activity.map)
        BackgroundGeolocation.removeWatcher({
              id: this.watcherId
        });

      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.pauseTimer();
      // if(this.backgroundMode.isActive())
      //   this.backgroundMode.disable();

    } else {
      this.startTimer();
      if (this.activity.map) {
        this.motionSense();
      } else {
        // if(!this.backgroundMode.isActive())
        //   this.backgroundMode.enable();
          this.motionSenseFijo();
      }
    }
  }

  stopTracking(){
    if(this.isTracking)
    {
      this.pauseTimer();
      this.isTracking=false;
      if (this.subscription) {

        this.subscription.unsubscribe();
      }
      if (this.activity.map){
        BackgroundGeolocation.removeWatcher({id: this.watcherId});
      }
      // if(this.backgroundMode.isActive())
      //   this.backgroundMode.disable();
    }
    this.saveActivity();
  }

  calcDistance(position) {
    console.log('calc distance', position);

    let latLng = new google.maps.LatLng(position.latitude, position.longitude);
    this.marker.setPosition({ lat: latLng.lat(), lng: latLng.lng() });
    this.trackedRoute.push(latLng);
    this.redrawPath(this.trackedRoute);
    this.map.setCenter(latLng);
    this.metros = this.roundNumber(google.maps.geometry.spherical.computeLength(this.trackedRoute), 100);
    const mtsToKm = this.roundNumber(this.metros * 0.001, 100);
    this.kilometros.next(mtsToKm.toString());
  }

  redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }

    if (path.length > 1) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#3880ff',
        strokeOpacity: 1.0,
        strokeWeight: 8
      });
      this.currentMapTrack.setMap(this.map);
    }
  }

  roundNumber(numToRound: number, decimals: number){
    const auxNumbRounded=Math.round(numToRound * decimals);
    const toDecimals= auxNumbRounded==0? 0: auxNumbRounded/ decimals;
    return toDecimals;
  }

  pauseTimer(){
    this.parcialTime = this.parcialTime + moment(new Date(Date.now())).diff(this.startDateTimer,'milliseconds');
    this.startDateTimer= new Date(Date.now());
    clearInterval(this.interval);
    clearInterval(this.redrawMap);
  }

  updateTimeValue(){
    let miliseconds: any = this.timer %1000;
    let seconds: any = (this.timer /1000) % 60;
    let minutes: any = ((this.timer /1000)/60)%60;
    let hours: any = ((this.timer /1000)/60)/ 60;
    this.timer = this.parcialTime + moment(new Date(Date.now())).diff(this.startDateTimer,'milliseconds');

    miliseconds= String('0'+ Math.floor(miliseconds)).slice(-3);
    minutes= String('0'+ Math.floor(minutes)).slice(-2);
    seconds= String('0'+ Math.floor(seconds)).slice(-2);
    hours= String('0'+ Math.floor(hours)).slice(-2);

    this.time = hours +':'+minutes+':'+seconds+','+miliseconds;
  }

  showHistoryRoute(route) {
    this.redrawPath(route);
  }

  saveActivity(){
    let challengeCompleted: boolean = false;
    this.uiServ.presentLoading()
    let challenge = null;

    const minutes=this.roundNumber((this.timer/1000)/60,100);
    let velocidad=0;
    if (minutes <= 0) {
      velocidad = 0;
    } else {
      velocidad = this.activity.map || this.activity.id==17 ? Number.parseFloat(this.kilometros.value) ==0? 0 : 60*Number.parseFloat(this.kilometros.value)/minutes: 1; //km por min
    }

    let cal:number=0;
    let auxMeps=[];
    let met=0;

    if(!this.activity.map && (this.activity.id!=17))
    {
      this.activity.mets_table.forEach(x => {
          auxMeps.push(x.met);
      })

      met =Math.max(...auxMeps);

    }

    if(this.activity.map && velocidad > 0 || this.activity.id==17){
      let auxMeps=[];
      this.activity.mets_table.forEach(x => {
        if (x.avg_speed>= velocidad) {
          auxMeps.push(x.met);
        }
      })
      if(auxMeps.length)
        met =Math.min(...auxMeps);
      else {
        this.activity.mets_table.forEach(x => {
          if (x.avg_speed< velocidad) {
            auxMeps.push(x.met);
          }
        });
        met =Math.max(...auxMeps);
      }
    }

    if (!met) {
      met=0;
    }
    cal = ((met * 3.5 * (this.usrPeso)) / 200)  * minutes;

    console.log('cal',cal);
    this.calorias.next(this.roundNumber(cal,100).toString());

    if (this.challenge
      && this.challenge.challenge
      && this.challenge.challenge.activity_type_id == this.activity.id) {
        const chall=this.challenge.challenge;
        challenge= chall.id;
        if (chall.target_calories) {
          challengeCompleted = this.challenge.progress.total_calories + Number.parseFloat(this.calorias.value) >= chall.target_calories;
        }
        if (chall.target_distance) {
          challengeCompleted = this.challenge.progress.total_distance + Number.parseFloat(this.kilometros.value) >= chall.target_distance;
        }
        if (chall.target_duration) {
          challengeCompleted = this.challenge.progress.total_duration + Math.round(this.timer/1000) >= chall.target_duration;
        }


    }

    this.activityServ.saveActivityUser(this.activity.id, this.usrLogueado.id,
      moment(this.startDate.toString()).format('YYYY-MM-DD hh:mm:ss'),
      moment(new Date(Date.now())).format('YYYY-MM-DD hh:mm:ss')
        , minutes.toString(),
         this.metros.toString(),this.roundNumber(cal,100).toString(), challenge, challengeCompleted, JSON.stringify( this.trackedRoute ))
       .then((resp)=>{
        let newActivity = resp.data;
        newActivity.activity_type = this.activity;
          let navigationExtras: NavigationExtras = {
            state: {
              activity: newActivity
            }
          };
          this.uiServ.dismissLoading();
          this.router.navigate(['/activity-detail'], navigationExtras);
       })
       .catch(async rej => {
         this.uiServ.dismissLoading();
         if (rej.message.includes('Undefined constant')) {

            this.router.navigate(['/activity-list']);
         } else
          this.uiServ.alertaInformativa(rej.message);
        })
  }


  private async motionSense() {

    var position  =
    BackgroundGeolocation.addWatcher(
      {
          // If the "backgroundMessage" option is defined, the watcher will
          // provide location updates whether the app is in the background or the
          // foreground. If it is not defined, location updates are only
          // guaranteed in the foreground. This is true on both platforms.

          // On Android, a notification must be shown to continue receiving
          // location updates in the background. This option specifies the text of
          // that notification.
          backgroundMessage: "Cancel to prevent battery drain.",

          // The title of the notification mentioned above. Defaults to "Using
          // your location".
          backgroundTitle: "Tracking You.",

          // Whether permissions should be requested from the user automatically,
          // if they are not already granted. Defaults to "true".
          requestPermissions: true,

          // If "true", stale locations may be delivered while the device
          // obtains a GPS fix. You are responsible for checking the "time"
          // property. If "false", locations are guaranteed to be up to date.
          // Defaults to "false".
          stale: false,

          // The minimum number of metres between subsequent locations. Defaults
          // to 0.
          distanceFilter: 10
      },
      ( location, error) =>{
          if (error) {
              if (error.code === "NOT_AUTHORIZED") {
                  if (window.confirm(
                      "This app needs your location, " +
                      "but does not have permission.\n\n" +
                      "Open settings now?"
                  )) {
                      // It can be useful to direct the user to their device's
                      // settings when location permissions have been denied. The
                      // plugin provides the 'openSettings' method to do exactly
                      // this.
                      BackgroundGeolocation.openSettings();
                  }
              }
              return console.error(error);
          }
          this.calcDistance(location);
          return location;
        }
      ).then((watcher_id) =>{
          // When a watcher is no longer needed, it should be removed by calling
          // 'removeWatcher' with an object containing its ID.
          this.watcherId= watcher_id;
          });
  }

}
