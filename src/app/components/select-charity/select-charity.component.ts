import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharityModel } from 'src/app/models/charity.model';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { UserService } from 'src/app/services/user.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-charity',
  templateUrl: './select-charity.component.html',
  styleUrls: ['./select-charity.component.scss'],
})
export class SelectCharityComponent implements OnInit {

  showDetail:boolean=false;
  charityList: Array<CharityModel>=[];
  charityDetail: CharityModel = new CharityModel();
  constructor(private userServ: UserService, 
    private router: Router, 
    private modalController: ModalController,
    private route: ActivatedRoute, 
    private uiServ: UiServiceService) {
      // this.userServ.getCharityList();
     }

  ngOnInit() {
    this.uiServ.presentLoading();
    this.userServ.getCharityList().then(resp => {
      this.charityList=resp;
      console.log(resp);
      this.uiServ.dismissLoading();
    }).catch(er => {
      this.uiServ.dismissLoading();
      this.uiServ.alertaInformativa(er);
    })
  }

  dismiss(id: number, name: string): void {
    this.modalController.dismiss(
      {
        'id': id,
        'name':name       
      }
    );
  }

  close(): void {
    if (this.showDetail)
      this.showDetail=false;
    else
      this.modalController.dismiss();
  }

  async goToDetails(charity) {
    this.charityDetail=charity;
    this.showDetail=true;
  }

}
