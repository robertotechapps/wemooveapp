import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, combineLatest, forkJoin, of, from } from 'rxjs';
import { concatMap, map, mergeMap } from 'rxjs/operators';

import { DataStore } from '../shell/data-store';
import { UserDashboardModel, UserModel, TotalAmountsModel, UserDetailModel } from '../models/user-profile.model';
import { TransferStateHelper } from '../utils/transfer-state-helper';
import { isPlatformServer } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';
import { CharityModel, UserCharityModel } from '../models/charity.model';
import { UserChallengeModel } from '../models/challenge.model';
import { Storage } from '@capacitor/storage';
import { ActivityService } from './activity.service';
import { ActivityModel, TodayTotalActivityModel } from '../models/activity.model';

import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';


const URL = environment.url;


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private profileDataStore: DataStore<UserModel>;
  private usrDashboardDataStore: DataStore<UserDetailModel>;
  private usrTotalAmountDataStore: DataStore<TotalAmountsModel>;
  private usrCharityDataStore: DataStore<UserCharityModel>;
  private usrChallengeDataStore: DataStore<UserChallengeModel|void>;
  private charityListDataStore: DataStore<Array<CharityModel>>;
  private todayActivityListDataStore: DataStore<Array<ActivityModel>>;
  private todayTotalActivityDataStore: DataStore<Array<ActivityModel>>;

  /***** borrar aca!! */
  private _user: UserModel;
  private userSubject: BehaviorSubject<UserModel>;
  public user$: Observable<UserModel>;
  /****** */
  private _userDetail: UserDetailModel;
  private userDetailSubject: BehaviorSubject<UserDetailModel>;
  public userDetail$: Observable<UserDetailModel>;

  private _userTotalAmount: TotalAmountsModel;
  private userTotalAmountSubject: BehaviorSubject<TotalAmountsModel>;
  public userTotalAmount$: Observable<TotalAmountsModel>;

  private _userCharity: UserCharityModel;
  private userCharitySubject: BehaviorSubject<UserCharityModel>;
  public userCharity$: Observable<UserCharityModel>;

  private _userChallenge: UserChallengeModel;
  private userChallengeSubject: BehaviorSubject<UserChallengeModel>;
  public userChallenge$: Observable<UserChallengeModel>;

  private _todayTotalActivity: TodayTotalActivityModel;
  private todayTotalActivitySubject: BehaviorSubject<TodayTotalActivityModel>;
  public todayTotalActivity$: Observable<TodayTotalActivityModel>;

  private _charityList: CharityModel[];
  private charityListSubject: BehaviorSubject<CharityModel[]>;
  public charityList$: Observable<CharityModel[]>;

  private _todayActivityList: Array<ActivityModel>;
  private todayActivityListSubject: BehaviorSubject<Array<ActivityModel>>;
  public todayActivityList$: Observable<ActivityModel[]>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferStateHelper: TransferStateHelper,
    private http: HttpClient,
    private authService: AuthServiceService,
    public translate: TranslateService,
    private activityServ: ActivityService
  ) { 
    /**** borrar aca */
    this.userSubject = new BehaviorSubject<UserModel>(this._user);
    this.user$ = this.userSubject.asObservable();
    /**** */

    this.userDetailSubject = new BehaviorSubject<UserDetailModel>(this._userDetail);
    this.userDetail$ = this.userDetailSubject.asObservable();
    this.userTotalAmountSubject = new BehaviorSubject<TotalAmountsModel>(this._userTotalAmount);
    this.userTotalAmount$ = this.userTotalAmountSubject.asObservable();
    this.userCharitySubject = new BehaviorSubject<UserCharityModel>(this._userCharity);
    this.userCharity$ = this.userCharitySubject.asObservable();
    this.userChallengeSubject = new BehaviorSubject<UserChallengeModel>(this._userChallenge);
    this.userChallenge$ = this.userChallengeSubject.asObservable();

    this.charityListSubject = new BehaviorSubject<CharityModel[]>(this._charityList);
    this.charityList$ = this.charityListSubject.asObservable();

    this.todayActivityListSubject = new BehaviorSubject<Array<ActivityModel>>(this._todayActivityList);
    this.todayActivityList$ = this.todayActivityListSubject.asObservable();

    this.todayTotalActivitySubject = new BehaviorSubject<TodayTotalActivityModel>(this._todayTotalActivity);
    this.todayTotalActivity$ = this.todayTotalActivitySubject.asObservable();
  }

    /**
   * * BORRAR
   */
     public setUsuario(usr: UserModel) {
      if (!usr) {
        usr= new UserModel();
      }

      this.userSubject.next(usr);
    }
    
    /**
     * BORRAR
     */
    public get usuario() {
      return this.userSubject.value;
    }

    public get usuarioDetail() {
      return this.userDetailSubject.value;
    }

     public setUsuarioDetail(usr: UserDetailModel) {
      if (!usr) {
        usr= new UserDetailModel();
      }

      this.userDetailSubject.next(usr);
    }
    
    /**
     * get usuario
     */
    public get usuarioTotalAmount() {
      return this.userTotalAmountSubject.value;
    }
     public setUsuarioTotalAmount(usr: TotalAmountsModel) {
      if (!usr) {
        usr= new TotalAmountsModel();
      }

      this.userTotalAmountSubject.next(usr);
    }
    
    /**
     * get usuario
     */
    public get usuarioCharity() {
      return this.userCharitySubject.value;
    }
     public setUsuarioCharity(usr: UserCharityModel) {
      if (!usr) {
        usr= new UserCharityModel();
      }

      this.userCharitySubject.next(usr);
    }

    public get charityList() {
      return this.charityListSubject.value;
    }
     public setCharityList(usr: Array<CharityModel>) {
      if (!usr) {
        usr= [];
      }

      this.charityListSubject.next(usr);
    }
    
    /**
     * get usuario
     */
    public get usuarioChallenge() {
      return this.userChallengeSubject.value;
    }
     public setUsuarioChallenge(usr: UserChallengeModel) {
      if (!usr) {
        usr= new UserChallengeModel();
      }

      this.userChallengeSubject.next(usr);
    }


    public getUserDashboardDataSource(): Observable<UserDetailModel> {
    
      let rawDataSource: Observable<UserDetailModel> = from( this.getUsrDetail());
  
      // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
      // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
      // duplicate http requests.
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('usr-dashboard-state', rawDataSource);
  
      return cachedDataSource;
    }
  
    public getUserDashboardStore(dataSource: Observable<UserDetailModel>): DataStore<UserDetailModel> {
      // Use cache if available
      if (!this.usrDashboardDataStore) {
        // Initialize the model specifying that it is a shell model
        const shellModel: UserDetailModel = new UserDetailModel();
        this.usrDashboardDataStore = new DataStore(shellModel);
      }
  
        // If running in the server, then don't add shell to the Data Store
        // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
        if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
          // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
          this.usrDashboardDataStore.load(dataSource, 0);
        } else { // On browser transitions
          // Trigger the loading mechanism (with shell)
          this.usrDashboardDataStore.load(dataSource);
        }
  
      return this.usrDashboardDataStore;
    }


    public getUserTotalAmountDataSource(): Observable<TotalAmountsModel> {
    
      let rawDataSource: Observable<TotalAmountsModel> = from(this.getTotalAmount());
  
      // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
      // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
      // duplicate http requests.
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('usr-total-amount-state', rawDataSource);
  
      return cachedDataSource;
    }
  
    public getUserTotalAmountStore(dataSource: Observable<TotalAmountsModel>): DataStore<TotalAmountsModel> {
      // Use cache if available
      if (!this.usrTotalAmountDataStore) {
        // Initialize the model specifying that it is a shell model
        const shellModel: TotalAmountsModel = new TotalAmountsModel();
        this.usrTotalAmountDataStore = new DataStore(shellModel);
      }
  
        // If running in the server, then don't add shell to the Data Store
        // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
        if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
          // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
          this.usrTotalAmountDataStore.load(dataSource, 0);
        } else { // On browser transitions
          // Trigger the loading mechanism (with shell)
          this.usrTotalAmountDataStore.load(dataSource);
        }
  
      return this.usrTotalAmountDataStore;
    }
    
    public getUserCharityDataSource(): Observable<UserCharityModel> {
    
      let rawDataSource: Observable<UserCharityModel> = from(this.getUserCharity());
  
      // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
      // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
      // duplicate http requests.
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('usr-charity-state', rawDataSource);
  
      return cachedDataSource;
    }
  
    public getUserCharityStore(dataSource: Observable<UserCharityModel>): DataStore<UserCharityModel> {
      // Use cache if available
      if (!this.usrCharityDataStore) {
        // Initialize the model specifying that it is a shell model
        const shellModel: UserCharityModel = new UserCharityModel();
        this.usrCharityDataStore = new DataStore(shellModel);
      }
  
        // If running in the server, then don't add shell to the Data Store
        // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
        if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
          // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
          this.usrCharityDataStore.load(dataSource, 0);
        } else { // On browser transitions
          // Trigger the loading mechanism (with shell)
          this.usrCharityDataStore.load(dataSource);
        }
  
      return this.usrCharityDataStore;
    }

    public getUserChallengeDataSource(): Observable<void | UserChallengeModel> {
    
      let rawDataSource: Observable<void | UserChallengeModel> = from(this.getUsrCurrentChallenge());
  
      // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
      // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
      // duplicate http requests.
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('usr-challenge-state', rawDataSource);
  
      return cachedDataSource;
    }
  
    public getUserChallengeStore(dataSource: Observable<void|UserChallengeModel>): DataStore<void|UserChallengeModel> {
      // Use cache if available
      if (!this.usrChallengeDataStore) {
        // Initialize the model specifying that it is a shell model
        const shellModel: UserChallengeModel = new UserChallengeModel();
        this.usrChallengeDataStore = new DataStore(shellModel);
      }
  
        // If running in the server, then don't add shell to the Data Store
        // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
        if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
          // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
          this.usrChallengeDataStore.load(dataSource, 0);
        } else { // On browser transitions
          // Trigger the loading mechanism (with shell)
          this.usrChallengeDataStore.load(dataSource);
        }
  
      return this.usrChallengeDataStore;
    }

  public getUserDataSource(token: string): Observable<UserModel> {
    
    let rawDataSource: Observable<UserModel> = this.getMe(token);

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('profile-state', rawDataSource);

    return cachedDataSource;
  }

  public getUserStore(dataSource: Observable<UserModel>): DataStore<UserModel> {
    // Use cache if available
    if (!this.profileDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: UserModel = new UserModel();
      this.profileDataStore = new DataStore(shellModel);
    }

      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.profileDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.profileDataStore.load(dataSource);
      }

    return this.profileDataStore;
  }

  async updateUser(gender:string, 
    weight:number,
    height:number,
    entBenefica:number,
    fehcaNac: string, lang: string, country: string, measureUnit: string) {


    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return new Promise<void> ((resolve, reject) => {

      this.http.patch(`${URL}/api/V1/users/update`, 
      {sex: gender == 'Femenino'? 'F':'M', weight,height,birth_date:fehcaNac, entity_id:entBenefica,measure_unit:measureUnit, country: country, lenguage:lang}
      ,requestOptions).subscribe(
        async resp => {
            let usr=this.usuario? this.usuario : new UserModel();
            let usrDetail= this.usuarioDetail? this.usuarioDetail: new UserDetailModel();
            usr.sex=gender == 'Femenino'? 'F':'M';            
            usrDetail.sex=gender == 'Femenino'? 'F':'M';
            usr.weight=weight;            
            usrDetail.weight=weight;
            usr.birth_date=new Date(fehcaNac);            
            usrDetail.birth_date=new Date(fehcaNac);
            usr.height=height;            
            usrDetail.height=height;
            usr.entity_id=entBenefica;            
            usrDetail.entity_id=entBenefica;
            // await this.getUserCharityDetails().then(char => {
            //   if (char) 
            //   usr.charity = char;
              
            // });
            if (usr.lenguage != lang) {
              usr.lenguage= lang;
              usrDetail.lenguage= lang;
              this.translate.use(lang);
            }
            
        // this.setUsuario(usr);
        this.setUsuarioDetail(usrDetail);
          resolve();
        }, (error) => {
          reject(error.error);
        }
        );
      });
  }

  async updateUserProfile(firstname:string, 
    lastname:string, 
    cell:string,
    avatar:string) {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return new Promise<void> ((resolve, reject) => {

      this.http.patch(`${URL}/api/V1/users/updateProfile`, 
      {firstname, lastname, cell, avatar}
      ,requestOptions).subscribe(
        async resp => {
            let usrDetail=this.usuarioDetail? this.usuarioDetail : new UserDetailModel();
            usrDetail.firstname=firstname;
            usrDetail.lastname=lastname;
            usrDetail.cell=cell;
            usrDetail.avatar= avatar;
        this.setUsuarioDetail(usrDetail);
          resolve();
        }, (error) => {
          reject(error.error);
        }
        );
      });

  }

  async updateUserWallet(account_id:string, user_id:number) {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return new Promise<void> ((resolve, reject) => {

      this.http.patch(`${URL}/api/V1/users/updateWallet`, 
      {account_id, user_id}
      ,requestOptions).subscribe(
        async resp => {
            let usr=this.usuario? this.usuario : new UserModel();
            let usrDetail=this.usuarioDetail? this.usuarioDetail : new UserDetailModel();
            usrDetail.account_id=account_id;
        this.setUsuario(usr);
        this.setUsuarioDetail(usrDetail);
          resolve();
        }, (error) => {
          reject(error.error);
        }
        );
      });
  }

  async getUsrDetail(): Promise<UserDetailModel> {
    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<UserDetailModel> ((resolve, reject) => {
       this.http.get(`${URL}/api/V1/users/me`, requestOptions).pipe(
        map( (data:{status:string,message:string,data:UserDetailModel}) =>{
          const usr: UserDetailModel= new UserDetailModel();
          usr.id =data.data['id'];
          usr.firstname =data.data['firstname'];
          usr.lastname =data.data['lastname'];
          usr.balance =data.data['balance'];
          usr.email =data.data['email'];
          usr.doc_type =data.data['doc_type'];
          usr.doc_number =data.data['doc_number'];

          const details = data.data['details'];
          usr.sex = details['sex'];
          usr.height = details['height'];
          usr.weight = details['weight'];
          if (usr.height && usr.weight) {
            usr.imc=usr.weight/(Math.pow(usr.height,2));
          }
          usr.cell = details['cell'];
          usr.measure_unit = details['measure_unit'];
          usr.country = details['country'];
          usr.lenguage = details['lenguage'];
          usr.entity_id = details['entity_id'];
          usr.birth_date = details['birth_date'];
          usr.avatar =  details['avatar'] ? (details['avatar']).replace('data','data:').replace('base64',';base64,'): null;
          if (usr.avatar && !usr.avatar.startsWith('data:image')) {
            usr.avatar = 'data:image/png;base64,'+ usr.avatar;
          }
          if (!usr.avatar) {
            usr.avatar='/assets/sample-images/icon.png';
          } 
          usr.created_at = details['created_at'];
          usr.lastLoginTime = new Date(Date.now()).getHours().toString() +':'+ new Date(Date.now()).getMinutes().toString();
          this.setUsuarioDetail(usr);
          return usr;
        })
      ).subscribe(
        async resp => {
          resolve(resp);
        }, (error) => {
          reject(error);
        });
      })
  }

  getMe(token: string): Observable<UserModel> {
      let headerDict = {Authorization:  token };
      const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
  
      return this.http.get<UserModel>(`${URL}/api/V1/users/me`, requestOptions).pipe(
        map( (data:any) =>{
          const usr: UserModel= new UserModel();
          usr.id =data.data['id'];
          usr.firstname =data.data['firstname'];
          usr.lastname =data.data['lastname'];
          usr.balance =data.data['balance'];
          usr.email =data.data['email'];
          usr.doc_type =data.data['doc_type'];
          usr.doc_number =data.data['doc_number'];

          const details = data.data['details'];
          usr.sex = details['sex'];
          usr.height = details['height'];
          usr.weight = details['weight'];
          if (usr.height && usr.weight) {
            usr.imc=usr.weight/(Math.pow(usr.height,2));
          }
          usr.cell = details['cell'];
          usr.measure_unit = details['measure_unit'];
          usr.country = details['country'];
          usr.lenguage = details['lenguage'];
          usr.entity_id = details['entity_id'];
          usr.birth_date = details['birth_date'];
          usr.avatar =  details['avatar'] ? (details['avatar']).replace('data','data:').replace('base64',';base64,'): '/assets/sample-images/icon.png';
          if (usr.avatar && !usr.avatar .startsWith('data:image')) {
            usr.avatar = 'data:image/png;base64,'+ usr.avatar;
          }
          usr.created_at = details['created_at'];
          usr.lastLoginTime = new Date(Date.now()).getHours().toString() +':'+ new Date(Date.now()).getMinutes().toString();
          return usr;
        })
      )
  }
  
  async getTotalAmount(filter?: string): Promise<TotalAmountsModel> {
    
    filter = filter?? 'total'
    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<TotalAmountsModel> ((resolve, reject) => {
    this.http.get(`${URL}/api/V1/users/getTotalAmounts?filter[period]=${filter}`, requestOptions)
      .pipe(
        map( (data:{data:any}) =>{
          const usr: TotalAmountsModel= new TotalAmountsModel();
          usr.totalCoins = data.data['total_earned'];
          usr.cotizacion =data.data['wemoove_value'];
          usr.totalDesafios =data.data['total_challenges_completed'];
          usr.totalLogros =data.data['total_achievements'];
          usr.totalActividades =data.data['total_activities'];
          usr.totalCalorias =data.data['total_calories'];
          usr.totalDistancia =data.data['total_distance'];
          usr.totalTiempo= data.data['total_duration'];
          usr.avgCalories= data.data['avg_calories'];
          usr.totalUsd = (usr.totalCoins * usr.cotizacion).toString()
          this.setUsuarioTotalAmount(usr);
          return usr;
        })
      ).subscribe(
        async resp => {
          resolve(resp);
        }, (error) => {
          reject(error);
        });
      });
  }

  //////  CHARITIES  //////

  public async getCharityListDataSource(): Promise<Observable<CharityModel[]>> {
    const rawDataSource = this.charityList$;

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('charity-list-state', rawDataSource);

    return cachedDataSource;
  }

  public getCharityListStore(dataSource: Observable<CharityModel[]>): DataStore<CharityModel[]> {
    // Use cache if available
    if (!this.charityListDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: Array<CharityModel> = [
        new CharityModel()
      ];
      this.charityListDataStore = new DataStore(shellModel);

    }
      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.charityListDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.charityListDataStore.load(dataSource);
      }

    return this.charityListDataStore;
  }

  async getCharityList(): Promise<Array<CharityModel>> {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<Array<CharityModel>> ((resolve, reject) => {
      this.http.get(`${URL}/api/V1/charities`,requestOptions)
      .pipe( map( (data: {status: string, message:string,data: Array<CharityModel>}) => {
        const charityList: Array<CharityModel> = data.data;
        charityList.forEach(async charity =>{
          charity.logo= 'data:image/png;base64,' + charity.logo;
        })
        return charityList;
      })
      ).subscribe(resp => {
        // this.setCharityList(resp);
        resolve(resp)
      },
                  err=> reject(err)
      )});
  }

  async getCharityDetails(id: number): Promise<CharityModel> {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<CharityModel> ((resolve, reject) => {
      this.http.get(`${URL}/api/V1/charities/${id}`,requestOptions)
      .pipe( map( (data: {status: string, message:string,data: CharityModel}) => {
        console.log(data);
        const charityDetail: CharityModel = data.data;
        return charityDetail;
      })
      ).subscribe(resp => resolve(resp),
                  err=> reject(err)
      )});
  }

  async getUserCharityDetails(): Promise<UserCharityModel> {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<UserCharityModel> ((resolve, reject) => {
      this.http.get(`${URL}/api/V1/users/charity`,requestOptions)
      .pipe( map( (data: {status: string, message:string,data: UserCharityModel}) => {
        console.log(data);
        const userCharityDetail: UserCharityModel = data.data;
        if (data.data.charity) {
          userCharityDetail.picture= 'data:image/png;base64,' + userCharityDetail.picture;
        }
        this.setUsuarioCharity(userCharityDetail);
        return userCharityDetail;
      })
      ).subscribe(resp => resolve(resp),
                  err=> reject(err)
      )});
  }
  
  async getUserCharity(): Promise<UserCharityModel> {
    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<UserCharityModel> ((resolve, reject) => {
    this.http.get(`${URL}/api/V1/users/charity`,requestOptions)
      .pipe( map( (data: {status: string, message:string,data: UserCharityModel}) => {
        console.log(data);
        let userCharityDetail: UserCharityModel = new UserCharityModel();
        userCharityDetail=data.data;
        if (data.data.charity) {
          userCharityDetail.picture= 'data:image/png;base64,' + userCharityDetail.picture;
        }
        userCharityDetail.queried=true;
        return userCharityDetail;
      })).subscribe(
        async resp => {
          this.setUsuarioCharity(resp);
          resolve(resp);
        }, (error) => {
          reject(error);
        });
      });
  }

 getUserCharityDetailsObs(token : string): Observable<UserCharityModel> {

    let headerDict = {Authorization:  token};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return this.http.get<UserCharityModel>(`${URL}/api/V1/users/charity`,requestOptions)
      .pipe( map( (data: UserCharityModel) => {
        console.log(data);
        const userCharityDetail: UserCharityModel = data;
        if (data.charity) {
          userCharityDetail.picture= 'data:image/png;base64,' + userCharityDetail.picture;
        }
        return userCharityDetail;
      })
      );
  }

  //////  USER CURRENT CHALLENGES  //////

  async getUsrCurrentChallenge(): Promise<UserChallengeModel | void>{
    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<UserChallengeModel | void> ((resolve, reject) => {
    this.http.get(`${URL}/api/V1/users/challenges?filter[status]=current`,requestOptions)
      .pipe( map( (data: {status: string, message:string, data: UserChallengeModel}) => {
        console.log(data);
        let userChallengeModel: UserChallengeModel = new UserChallengeModel();
        userChallengeModel = data.data;
        userChallengeModel.queried=true;
        if (userChallengeModel && userChallengeModel.challenge) {
          userChallengeModel.challenge.picture= 'data:image/png;base64,' + userChallengeModel.challenge.picture;
        }
        if (userChallengeModel && userChallengeModel.left_time_minutes) {
          let minutes: any = userChallengeModel.left_time_minutes%60;
          let hours: any = userChallengeModel.left_time_minutes / 60;
          minutes= String('0'+ Math.floor(minutes)).slice(-2);
          hours= String('0'+ Math.floor(hours)).slice(-2);
          userChallengeModel.leftHours = `${hours}:${minutes}`
        }
        this.setUsuarioChallenge(userChallengeModel);
        return userChallengeModel;
      })
      ).subscribe(
        async resp => {
          resolve(resp);
        }, (error) => {
          reject(error);
        });
      });
  }

  //////  USER TODAY ACTIVITIES //////
  public async getTodayActivityListDataSource(): Promise<Observable<ActivityModel[]>> {
    const rawDataSource = this.todayActivityList$;

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('today-activity-list-state', rawDataSource);

    return cachedDataSource;
  }

  public getTodayActivityListStore(dataSource: Observable<Array<ActivityModel>>): DataStore<Array<ActivityModel>> {
    // Use cache if available
    if (!this.todayActivityListDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: Array<ActivityModel> = [
        new ActivityModel(),
        new ActivityModel(),
        new ActivityModel(),
        new ActivityModel(),
        new ActivityModel(),
        new ActivityModel()
      ];
      this.todayActivityListDataStore = new DataStore(shellModel);

    }
      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.todayActivityListDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.todayActivityListDataStore.load(dataSource);
      }

    return this.todayActivityListDataStore;
  }

  async getTodayTotalActivity(): Promise<Array<ActivityModel>> {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<Array<ActivityModel>> ((resolve, reject) => {
      this.http.get(`${URL}/api/V1/users/activities?filter[when]=today`,requestOptions)
      .pipe( map( (data: {status: string, message:string,data: Array<ActivityModel>}) => {
        const todayActivityList: Array<ActivityModel> = data.data;
        this._todayTotalActivity=new TodayTotalActivityModel();
        todayActivityList.forEach(async activity =>{
          activity.activity_type.icon= activity.activity_type.icon.startsWith('data:image')?activity.activity_type.icon:'data:image/png;base64,' + activity.activity_type.icon;
          this.getTodayTotals(activity);
        });
        this.todayTotalActivitySubject.next(this._todayTotalActivity);
        return todayActivityList;
      })
      ).subscribe(resp => {
        this.todayActivityListSubject.next(resp);
        resolve(resp)
      },
        err=> reject(err)
      )});
  }
  
  getTodayTotalActivity$(token: string): Observable<TodayTotalActivityModel> {

    let headerDict = {Authorization:  token};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return this.http.get(`${URL}/api/V1/users/activities?filter[when]=today`,requestOptions)
      .pipe( map( (data: {status: string, message:string,data: Array<ActivityModel>}) => {
        const todayActivityList: Array<ActivityModel> = data.data;
        this._todayTotalActivity=new TodayTotalActivityModel();
        todayActivityList.forEach(async activity =>{
          activity.activity_type.icon= activity.activity_type.icon.startsWith('data:image')?activity.activity_type.icon:'data:image/png;base64,' + activity.activity_type.icon;
          this.getTodayTotals(activity);
        });
        return this._todayTotalActivity;
      })
      );
  }

  public getTodayTotalActivityDataSource(): Observable<Array<ActivityModel>> {
    const rawDataSource = from(this.getTodayTotalActivity());

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('today-total-activity-state', rawDataSource);

    return cachedDataSource;
  }

  public getTodayTotalActivityStore(dataSource: Observable<Array<ActivityModel>>): DataStore<Array<ActivityModel>> {
    // Use cache if available
    if (!this.todayTotalActivityDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: Array<ActivityModel> = [new ActivityModel()];
      this.todayTotalActivityDataStore = new DataStore(shellModel);
    }
      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.todayTotalActivityDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.todayTotalActivityDataStore.load(dataSource);
      }

    return this.todayTotalActivityDataStore;
  }

  getTodayTotals(activity: ActivityModel) {
    console.log("totales",activity );
    this._todayTotalActivity.total_calories +=  Number.parseFloat(activity.total_calories);
    this._todayTotalActivity.total_earn += Number.parseFloat(activity.total_earn);
    this._todayTotalActivity.total_coins += Number.parseFloat(activity.total_coins);
    if (!this._todayTotalActivity.firstActivityDate) 
      this._todayTotalActivity.firstActivityDate = moment( activity.start_date, 'dd/mm/yyyy HH:min:ss').toDate();
    else
      if (moment(this._todayTotalActivity.firstActivityDate).isAfter(moment(activity.start_date))) 
        this._todayTotalActivity.firstActivityDate = moment( activity.start_date, 'dd/mm/yyyy HH:min:ss').toDate();
    
    const idx = this._todayTotalActivity.activityList.findIndex( x => x.activity_type_id == activity.activity_type_id);
    if (idx < 0) 
      this._todayTotalActivity.activityList.push({activity_type_id: activity.activity_type_id,
        activity_type_name: activity.activity_type.name,
        total_calories: activity.total_calories,
        icon: activity.activity_type.icon})
    else 
      this._todayTotalActivity.activityList[idx].total_calories += activity.total_calories;
  }

  ValidarToken(){
    return new Promise<boolean>( async resolve => {
      const token = await Storage.get({key: 'token'});
      if (token.value) {
        if (!this.usuarioDetail) {
          
          await this.getUsrDetail()
          .then(ud =>{
            console.log('valida toke',this.usuarioDetail)
            this.setUsuarioDetail(ud);
            resolve(true);
          })
          .catch(()=> {
            resolve(false)})
        }
        // resolve(true);
      } else{
        resolve(false);
      }
    });
  }

  logOutUser(){
    this.setUsuarioDetail(null);
    this.setUsuarioChallenge(null);
    this.setUsuarioCharity(null);
    this.setUsuarioTotalAmount(null);
  }
}
