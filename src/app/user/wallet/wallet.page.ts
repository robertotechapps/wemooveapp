import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { WalletService } from 'src/app/services/wallet.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { WalletModel, WalletLinkModel } from 'src/app/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserDashboardModel } from 'src/app/models/user-profile.model';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  translations;
  movementsList:WalletModel[] = [];
  movementsLinks:WalletLinkModel = new WalletLinkModel();
  profile: UserDashboardModel= new UserDashboardModel();
  totAmountStateSubscription: Subscription;
  userStateSubscription: Subscription;
  total: number;
  balance: number;
  walletForm: FormGroup;
  show: boolean;

  constructor(private router:Router,
     private walletServ:WalletService, 
      private uiServ: UiServiceService,
      private usrService: UserService,
      public translate: TranslateService) { 
        this.show = false;
        this.userStateSubscription=this.usrService.userDetail$.subscribe( uc =>{
          this.profile.userDetail=uc;
          if (this.profile.userDetail.account_id != '') {
            this.walletForm.controls['account_id'].setValue(this.profile.userDetail.account_id);
           
          }
        });
        this.totAmountStateSubscription=this.usrService.userTotalAmount$.subscribe( uc =>{
          this.profile.totalAmounts=uc;
          this.total= this.profile.totalAmounts.totalCoins;
          if(this.profile.totalAmounts.cotizacion != null)
          {
            this.balance = this.profile.totalAmounts.totalCoins * this.profile.totalAmounts.cotizacion;
          }
          else
            this.balance = this.profile.totalAmounts.totalCoins;
          
        });
        this.walletForm = new FormGroup({
          'account_id': new FormControl('', Validators.required)
        });
        
  }

  async ngOnInit() {
    this.uiServ.presentLoading();
    await this.walletServ.getMovements().then((links) =>{
      this.movementsLinks =links;
      console.log(this.walletServ.walletList);
      this.movementsList=this.walletServ.walletList;
      this.uiServ.dismissLoading();
    });
    this.uiServ.dismissLoading();
    this.getTranslations();
    this.show = false;
  }
  ngOnDestroy(): void {
    this.userStateSubscription.unsubscribe();
    this.totAmountStateSubscription.unsubscribe();
  }
  getTranslations() {
    this.translate.getTranslation(this.translate.currentLang)
    .subscribe((translations) => this.translations = translations);
  }

  createWorder(){
      this.router.navigate(['/worder']);
    }
    openWalletSite = async () => {
      window.open('https://www.mynearwallet.com/' );
    };

    enableWallet()
    {
      this.show = true;
    }

    storeWallet()
    {
      this.profile.userDetail.account_id = this.walletForm.value.account_id;
      this.uiServ.presentLoading();

    this.usrService.updateUserWallet(this.walletForm.value.account_id, this.profile.userDetail.id)
    .then(() => {
      this.uiServ.dismissLoading();
      this.show = false;
      this.router.navigate(['/wallet']);
    })
    .catch( async rej => {
      this.uiServ.dismissLoading();
      this.uiServ.alertaInformativa(rej.message);
    });
    }

    async onIonInfinite(ev) {
      if (this.movementsLinks.next) {
        await this.walletServ.getMovements(this.movementsLinks.next).then((links) =>{
          this.movementsLinks =links;
          this.walletServ.walletList.forEach(item => {
            this.movementsList.push(item);
          });
        });
      }  
      (ev as InfiniteScrollCustomEvent).target.complete();
    }

}
