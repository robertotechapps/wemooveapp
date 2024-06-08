import { Component, ElementRef, EventEmitter, HostBinding, OnInit, ViewChild } from '@angular/core';
import { LanguageService } from '../../language/language.service';
import { ActivityModel } from '../../models/activity.model';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { th } from 'date-fns/locale';

declare var google;

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.page.html',
  styleUrls: ['./activity-detail.page.scss'],
})
export class ActivityDetailPage implements OnInit {
  activity: ActivityModel;
  translations;
  totalDistancia;
  stringTime;

  map: any;
  currentMapTrack = null;
  trackedRoute = [];
  mapIsLoaded=false;
  initMarker:any;
  endMarker:any;

  @ViewChild('map') mapElement: ElementRef;
  public $mapReady: EventEmitter<any> = new EventEmitter();


  @HostBinding('class.is-shell') get isShell() {
    return (this.activity && this.activity.isShell) ? true : false;
  }

  constructor(
    public languageService: LanguageService,
    public translate: TranslateService,  private plt: Platform,
    public route: ActivatedRoute, private router: Router
  ) { 
    this.route.queryParams.subscribe(params=>{
      if (this.router.getCurrentNavigation().extras.state) {
        this.activity =this.router.getCurrentNavigation().extras.state.activity;
        if (this.activity) {
          const totalSeconds=Math.round(Number.parseFloat(this.activity.total_duration)*60);
          let seconds: any =  totalSeconds % 60;
          let minutes: any = (totalSeconds/60)%60;
          let hours: any = (totalSeconds/60) / 60;

          minutes= String('0'+ Math.floor(minutes)).slice(-2);
          seconds= String('0'+ Math.floor(seconds)).slice(-2);
          hours= String('0'+ Math.floor(hours)).slice(-2);
          console.log('distancia', this.activity.total_distance) ;
          this.totalDistancia= Number.parseFloat( this.activity.total_distance) * 0.001 ;
          this.stringTime= hours +':'+minutes+':'+seconds;
          if(this.activity && this.activity.activity_type && this.activity.activity_type.map)
          {
            if (this.activity.route && this.activity.route.length) {
            
              this.trackedRoute = JSON.parse(this.activity.route);
              this.plt.ready().then(()=>{
                if (this.mapIsLoaded) {
                  this.setRoute();
                }
  
              })
            }
          }

        }
      }
    })
  }

  ngOnInit(): void {
    this.getTranslations();

    this.translate.onLangChange.subscribe(()=> this.getTranslations());
  }

  ionViewDidEnter(){
    this.initMap();
    this.getTranslations();
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  goBack(){
    this.router.navigate(['/activity-list']);
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

    if (this.trackedRoute.length > 1) {
      this.setRoute();
    }
    this.mapIsLoaded=true;
  }

  private setRoute() {
    let initLatLng = new google.maps.LatLng(this.trackedRoute[0].lat, this.trackedRoute[0].lng);
    let endLatLng = new google.maps.LatLng(this.trackedRoute[this.trackedRoute.length-1].lat, this.trackedRoute[this.trackedRoute.length-1].lng);
    // this.map.setCenter(initLatLng);
    // this.map.setZoom(16);
    this.redrawPath(this.trackedRoute);

    var image = {
      url: "./assets/img/iconMap_3.png"
    };

    this.initMarker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: initLatLng,
      icon: image,
    });

    if(initLatLng != endLatLng)
      this.endMarker = new google.maps.Marker({
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: endLatLng,
        icon: image,
      });
  }

  redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }
    
    if (path.length > 1) {
      var bounds = new google.maps.LatLngBounds();

      console.log('center',bounds.getCenter());
      this.map.setCenter(bounds.getCenter());
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#3880ff',
        strokeOpacity: 1.0,
        strokeWeight: 7//,
      });
      
      this.currentMapTrack.setMap(this.map);
      this.currentMapTrack.getPath().forEach(element => {
        bounds.extend(element);
      });
      this.map.fitBounds(bounds);
    }
  }

}
