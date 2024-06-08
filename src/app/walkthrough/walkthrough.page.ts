import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IonRouterOutlet, MenuController, ModalController } from '@ionic/angular';
import { UiServiceService } from '../services/ui-service.service';
import { UserService } from '../services/user.service';

import { format, parseISO} from 'date-fns';
import { map } from 'rxjs/operators';
import { DataStore } from '../shell/data-store';
import { UserModel } from '../models/user-profile.model';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SelectCharityComponent } from '../components/select-charity/select-charity.component';
import * as moment from 'moment';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: [
    './styles/walkthrough.page.scss',
    './styles/walkthrough.shell.scss',
    './styles/walkthrough.responsive.scss'
  ]
})
export class WalkthroughPage implements OnInit, OnDestroy{

  genders: Array<string>;
  countries: Array<string>;
  showPicker: boolean=false;
  translations;
  stateSubscription: Subscription;
  language: string;
  measureUnit: string;
  walkthroughForm: FormGroup;
  entBeneficaName='';
  fechaNac = '';
  validations = {
    // 'gender': [
    //   { type: 'required', message: 'Gender is required.' }
    // ],
    'weight': [
      { type: 'required', message: 'Weight is required.' }
    ],
    'height': [
      { type: 'required', message: 'Height is required.' }
    ],
    'beneficEntity': [
      { type: 'required', message: 'Charity is required.' }
    ]//,
    // 'fechaNac': [
    //   { type: 'required', message: 'Birth date is required.' }
    // ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    private uiServ: UiServiceService,
    public userServ: UserService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    public routerOutlet: IonRouterOutlet,
    public translate: TranslateService
  ) { 

    this.genders = [
      'Femenino',
      'Masculino'
    ];

    this.countries = [
      'Centroamérica',
      'Norteamérica',
      'Sudamérica'
    ]

    this.walkthroughForm = new FormGroup({
      'gender': new FormControl(''/*, Validators.compose([Validators.required])*/),
      'weight': new FormControl( 30, Validators.compose([Validators.required])),
      'height': new FormControl(120, Validators.compose([Validators.required])),
      'fechaNac': new FormControl(''/*, Validators.compose([Validators.required])*/),
      'beneficEntity': new FormControl(Validators.compose([Validators.required])),
      'country': new FormControl(''),
    })
    
    this.stateSubscription =this.userServ.userDetail$.subscribe( state =>{
      if(state) {

        if (state.birth_date) {
          this.walkthroughForm.controls['fechaNac'].setValue(moment.utc(state.birth_date,'YYYY-MM-DD').format('DD-MM-YYYY'));
          this.fechaNac = moment.utc(state.birth_date).format('YYYY-MM-DD');//+ 'T09:00:00.000Z';
        }
        if (state.weight) {
          this.walkthroughForm.controls['weight'].setValue(state.weight.toString());
        }
        if (state.height) {
          this.walkthroughForm.controls['height'].setValue(state.height.toString());
        }
        if (state.sex) {
          this.walkthroughForm.controls['gender'].setValue(state.sex =='F'? 'Femenino':'Masculino');
        }
        if (state.country) {
          this.walkthroughForm.controls['country'].setValue(state.country);
        }
        if (state.entity_id) {
          this.walkthroughForm.controls['beneficEntity'].setValue(state.entity_id);
          if (!(this.userServ.usuarioCharity && this.userServ.usuarioCharity.charity)) {
            this.userServ.getUserCharity().then(cha => {
              this.entBeneficaName = cha.charity.name;
            })
          }
          else
            this.entBeneficaName = this.userServ.usuarioCharity.charity.name;
  
        }
      }
      console.log('perfil',state);
    });
  }
  ngOnInit(): void {
    this.route.data.pipe(
      map((resolvedRouteData) => {
        const resolvedDataStores = resolvedRouteData['data'];
        const userDataStore: DataStore<UserModel> = resolvedDataStores;
      })
    ).subscribe();
    this.getTranslations();
  
    this.translate.onLangChange.subscribe(()=> this.getTranslations());
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  ngOnDestroy(): void {
    if(this.stateSubscription)
      this.stateSubscription.unsubscribe();
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  async doSubmit(){
    this.uiServ.presentLoading();
    console.log('do submit');

    await Device.getLanguageCode().then(code=>{
      this.language= code.value.split('-')[0];
      this.measureUnit=this.language=='en'?'2':'1';
    });

     this.userServ.updateUser(this.walkthroughForm.value.gender, 
                              this.walkthroughForm.value.weight,
                              this.walkthroughForm.value.height,
                              this.walkthroughForm.value.beneficEntity,
                              this.fechaNac,this.language,
                              this.walkthroughForm.value.country,
                              this.measureUnit).then( () => {
      //navegar
       this.uiServ.dismissLoading();
      this.uiServ.alertaGoRoute('Ya hemos registrados tus datos! Comencemos!','/activities');
     })
         .catch(async rej => {
      this.uiServ.dismissLoading();
         this.uiServ.alertaInformativa(rej.message);
    });
     

  }
  
  formatDate(value:any) {
    this.fechaNac=moment(value).format('YYYY-MM-DD');
    this.walkthroughForm.controls['fechaNac'].setValue(moment.utc(this.fechaNac,'YYYY-MM-DD').format('DD-MM-YYYY'));
    this.showPicker=false;
    console.log('valorrr', this.showPicker)
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
          
          this.walkthroughForm.controls['beneficEntity'].setValue(data.data['id']);
          this.entBeneficaName= data.data['name'];
        }
    });

    return await modal.present();
  }

}


