import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WalletModel, WalletLinkModel } from '../models/wallet.model';
import { AuthServiceService } from './auth-service.service';
import { environment } from '../../environments/environment';
import { ActivityService } from './activity.service';
import { map } from 'rxjs/operators';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  
  private curWalletList:WalletModel[];
  private currentWalletListSubject: BehaviorSubject<WalletModel[]>;
  public currentWalletList: Observable<WalletModel[]>;

  constructor(private authService: AuthServiceService,
    private activityServ: ActivityService,
    private http: HttpClient) { 
      this.currentWalletListSubject = new BehaviorSubject<WalletModel[]>(this.curWalletList);
      this.currentWalletList = this.currentWalletListSubject.asObservable();
    }

  public setWalList(achList: WalletModel[]) {
    if (!achList) {
      achList= [];
    }

    this.currentWalletListSubject.next(achList);
  }

  public get walletList() {
    return this.currentWalletListSubject.value;
  }

  async getMovements(link: string = null) {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    let _url= link?? `${URL}/api/V1/users/transactions`;

    return new Promise<WalletLinkModel> ((resolve, reject) => {
      this.http.get<WalletModel[]>(_url, requestOptions).subscribe(
        async resp => {
            const ach: WalletModel[] = resp['data'];
            const links: WalletLinkModel = resp['links'];
            this.setWalList(ach);
            resolve(links);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async saveWOrderUser(amount:number, user_id:number) {
    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return new Promise<boolean> ((resolve, reject) => {
      this.http.post(`${URL}/api/V1/users/worder`, {amount,user_id},requestOptions).subscribe(
        async resp => {
          console.log('save worder',resp);
          resolve(true);
        }, (error) => {
          reject(error.error);
        }
        );
      });
  }

  async saveWIdUser(account_id:string, user_id:number) {
    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return new Promise<boolean> ((resolve, reject) => {
      this.http.post(`${URL}/api/V1/users/walletid`, {account_id,user_id},requestOptions).subscribe(
        async resp => {
          console.log('save wallet id',resp);
          resolve(true);
        }, (error) => {
          reject(error.error);
        }
        );
      });
  }

  
}
