import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from 'src/app/services/wallet.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { WalletModel } from 'src/app/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UserDashboardModel } from 'src/app/models/user-profile.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-worder',
  templateUrl: './worder.page.html',
  styleUrls: ['./worder.page.scss'],
})
export class WOrderPage implements OnInit {
  translations;
  profile: UserDashboardModel= new UserDashboardModel();
  totAmountStateSubscription: Subscription;
  userStateSubscription: Subscription;
  amount: number;
  available: number;
  total: number;
  worderForm: FormGroup;
  validations = {
    'amount': [
      { type: 'required', message: 'amount must be grater than 0.' }
    ],
  };

  constructor(private router:Router,
     private walletServ:WalletService, 
     private usrService: UserService,
      private uiServ: UiServiceService,
      public translate: TranslateService) { 

        this.userStateSubscription=this.usrService.userDetail$.subscribe( uc =>{
          this.profile.userDetail=uc;
        });
        this.totAmountStateSubscription=this.usrService.userTotalAmount$.subscribe( uc =>{
          this.profile.totalAmounts=uc;
          this.total= this.profile.totalAmounts.totalCoins;
          this.available = this.total - this.profile.userDetail.minimal_amount;
        });

        this.worderForm = new FormGroup({
          'amount': new FormControl(this.available, Validators.compose([Validators.required]))
        });
  }

  async ngOnInit() {
    this.getTranslations();
  }

  getTranslations() {
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  ngOnDestroy(): void {
    this.userStateSubscription.unsubscribe();
    this.totAmountStateSubscription.unsubscribe();
  }

  saveWOrder(){
    this.uiServ.presentLoading()
    if(this.amount <= this.available)
    {
      this.walletServ.saveWOrderUser(this.amount, this.profile.userDetail.id)
      .then(()=>{
         this.uiServ.dismissLoading();
         this.router.navigate(['/wallet']);
      })
      .catch(async rej => {
        this.uiServ.dismissLoading();
        this.uiServ.alertaInformativa(rej.message);
       })
    }
    else
    {
      this.uiServ.dismissLoading();
        this.uiServ.alertaInformativa('Insufficient founds');
    }
  }

}
