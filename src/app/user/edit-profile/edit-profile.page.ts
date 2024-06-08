import { Component, OnInit, ViewChild, HostBinding, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDashboardModel, UserModel } from 'src/app/models/user-profile.model';
import { UserService } from 'src/app/services/user.service';
import { DataStore } from 'src/app/shell/data-store';
import { UiServiceService } from '../../services/ui-service.service';
import * as moment from 'moment';
import { SelectCharityComponent } from 'src/app/components/select-charity/select-charity.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit, OnDestroy {

  translations;
  editForm: FormGroup;
  matching_passwords_group: FormGroup;
  genders: Array<string>;
  userStateSubscription: Subscription;
  profile: UserDashboardModel= new UserDashboardModel();
  fechaNac = '';
  entBeneficaName='';
  showPicker: boolean=false;

  validation_messages = {
    'firstname': [
      { type: 'required', message: 'NOMBRE_REQUERIDO' }
    ],
    'lastname': [
      { type: 'required', message: 'APELLIDO_REQUERIDO' }
    ],'gender': [
      { type: 'required', message: 'Gender is required.' }
    ],
    'weight': [
      { type: 'required', message: 'Weight is required.' }
    ],
    'height': [
      { type: 'required', message: 'Height is required.' }
    ],
    'beneficEntity': [
      { type: 'required', message: 'Charity is required.' }
    ],
    'fechaNac': [
      { type: 'required', message: 'Birth date is required.' }
    ]
  };

  constructor(  public translate: TranslateService,
    private route: ActivatedRoute,
    public usrService: UserService,
    public uiServ: UiServiceService,
    private router: Router,
    private modalController: ModalController
    ) { 
    
      this.userStateSubscription=this.usrService.userDetail$.subscribe( uc =>{
        this.profile.userDetail=uc;
        
      });

      this.genders = [
        'Femenino',
        'Masculino'
      ];

      this.editForm = new FormGroup({
        'firstname': new FormControl('', Validators.required),
        'lastname': new FormControl('', Validators.required),
        'gender': new FormControl('', Validators.compose([Validators.required])),
        'weight': new FormControl( 30, Validators.compose([Validators.required])),
        'height': new FormControl(120, Validators.compose([Validators.required])),
        'fechaNac': new FormControl('', Validators.compose([Validators.required])),
        'beneficEntity': new FormControl(Validators.compose([Validators.required])),
        'country': new FormControl('')
      });

  }

  async ngOnInit(): Promise<void> {
    if (this.profile.userDetail.firstname) {
      this.editForm.controls['firstname'].setValue(this.profile.userDetail.firstname);
    }
    if (this.profile.userDetail.lastname) {
      this.editForm.controls['lastname'].setValue(this.profile.userDetail.lastname);
    }
    if (this.profile.userDetail.birth_date) {
      this.editForm.controls['fechaNac'].setValue(moment.utc(this.profile.userDetail.birth_date,'YYYY-MM-DD').format('DD-MM-YYYY'));
      this.fechaNac = moment.utc(this.profile.userDetail.birth_date).format('YYYY-MM-DD');//+ 'T09:00:00.000Z';
    }
    if (this.profile.userDetail.weight) {
      this.editForm.controls['weight'].setValue(this.profile.userDetail.weight.toString());
    }
    if (this.profile.userDetail.height) {
      this.editForm.controls['height'].setValue(this.profile.userDetail.height.toString());
    }
    if (this.profile.userDetail.sex) {
      this.editForm.controls['gender'].setValue(this.profile.userDetail.sex =='F'? 'Femenino':'Masculino');
    }
    if (this.profile.userDetail.country) {
      this.editForm.controls['country'].setValue(this.profile.userDetail.country);
    }
    if (this.profile.userDetail && this.profile.userDetail.entity_id) {
      this.editForm.controls['beneficEntity'].setValue(this.profile.userDetail.entity_id);
      if (!(this.usrService.usuarioCharity && this.usrService.usuarioCharity.charity)) {
        this.usrService.getUserCharity().then(cha => {
          this.entBeneficaName = cha.charity.name;
        })
      }
      else
        this.entBeneficaName = this.usrService.usuarioCharity.charity.name;

    }
    this.getTranslations();
  }

  ngOnDestroy(): void {
    this.userStateSubscription.unsubscribe();
  }

  updateUser(){
    this.uiServ.presentLoading();

    this.usrService.updateUserProfile(this.editForm.value.firstname, this.editForm.value.lastname, this.profile.userDetail.cell? this.profile.userDetail.cell:'0', this.profile.userDetail.avatar)
    .then(() => {
      this.usrService.updateUser(this.editForm.value.gender, 
        this.editForm.value.weight,
        this.editForm.value.height,
        this.editForm.value.beneficEntity,
        this.fechaNac,this.profile.userDetail.lenguage,
        this.editForm.value.country,
        this.profile.userDetail.measure_unit).then( () => {
          //navegar
          this.uiServ.dismissLoading();
          this.router.navigate(['user-profile']);
          })
          .catch(async rej => {
          this.uiServ.dismissLoading();
          this.uiServ.alertaInformativa(rej.message);
          });
    })
    .catch( async rej => {
      this.uiServ.dismissLoading();
      this.uiServ.alertaInformativa(rej.message);
    });
  }
  
  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  formatDate(value:any) {
    this.fechaNac=moment(value).format('YYYY-MM-DD');
    this.editForm.controls['fechaNac'].setValue(moment.utc(this.fechaNac,'YYYY-MM-DD').format('DD-MM-YYYY'));
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
          
          this.editForm.controls['beneficEntity'].setValue(data.data['id']);
          this.entBeneficaName= data.data['name'];
        }
    });

    return await modal.present();
  }

}
