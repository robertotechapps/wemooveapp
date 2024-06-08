import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ChallengeModel, UserChallengeModel } from '../models/challenge.model';
import { AuthServiceService } from './auth-service.service';
import { environment } from '../../environments/environment';
import { ActivityService } from './activity.service';
import { ActivityTypeModel } from '../models/activity-type.model';
import { map } from 'rxjs/operators';
import { DataStore } from '../shell/data-store';
import { TransferStateHelper } from '../utils/transfer-state-helper';
import { isPlatformServer } from '@angular/common';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private challengeListDataStore: DataStore<Array<ChallengeModel>>;
  private challengeDataStore: DataStore<ChallengeModel>;
  
  private _challengeList: Array<ChallengeModel>;
  private challengeListSubject: BehaviorSubject<Array<ChallengeModel>>;
  private userChallengeSubject: BehaviorSubject<UserChallengeModel>;
  public challengeList$: Observable<Array<ChallengeModel>>;

  private _challenge: ChallengeModel;
  private _userChallenge: UserChallengeModel;
  private challengeSubject: BehaviorSubject<ChallengeModel>;
  public challenge$: Observable<ChallengeModel>;
  public userChallenge$: Observable<UserChallengeModel>;

  private _isLoadingChallengeList: boolean = false;
  private isLoadingChallengeListSubject: BehaviorSubject<boolean>;
  public isLoadingChallengeList$: Observable<boolean>;

  private _isLoadingChallenge: boolean = false;
  private isLoadingChallengeSubject: BehaviorSubject<boolean>;
  public isLoadingChallenge$: Observable<boolean>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private authService: AuthServiceService,
    private activityServ: ActivityService,
    private transferStateHelper: TransferStateHelper,
    private http: HttpClient) { 
      this.challengeListSubject = new BehaviorSubject<Array<ChallengeModel>>(this._challengeList);
      this.challengeList$ = this.challengeListSubject.asObservable();

      this.challengeSubject = new BehaviorSubject<ChallengeModel>(this._challenge);
      this.challenge$ = this.challengeSubject.asObservable();

      this.userChallengeSubject = new BehaviorSubject<UserChallengeModel>(this._userChallenge);
      this.userChallenge$ = this.userChallengeSubject.asObservable();

      this.isLoadingChallengeListSubject = new BehaviorSubject<boolean>(this._isLoadingChallengeList);
      this.isLoadingChallengeList$ = this.isLoadingChallengeListSubject.asObservable();
      
      this.isLoadingChallengeSubject = new BehaviorSubject<boolean>(this._isLoadingChallenge);
      this.isLoadingChallenge$ = this.isLoadingChallengeSubject.asObservable();
    }

  public toggleIsLoadingChallengeList(isLoading: boolean) {
    this.isLoadingChallengeListSubject.next(isLoading);
  }

  public get isLoadingChallengeList() {
    return this.isLoadingChallengeListSubject.value;
  }

  public toggleIsLoadingChallenge(isLoading: boolean) {
    this.isLoadingChallengeSubject.next(isLoading);
  }

  public get isLoadingChallenge() {
    return this.isLoadingChallengeSubject.value;
  }

  public setChaList(chaList: Array<ChallengeModel>) {
    if (!chaList) {
      chaList= [];
    }

    this.challengeListSubject.next(chaList);
  }

  public get challengeList() {
    return this.challengeListSubject.value;
  }

  public setChallenge(challenge: ChallengeModel) {

    this.challengeSubject.next(challenge);
  }

  public setUserChallenge(challenge: UserChallengeModel) {

    this.userChallengeSubject.next(challenge);
  }

  public get challenge() {
    return this.challengeSubject.value;
  }

  /**
   * 
   * ChallengeList
   *  
   */
  public getChallengeListDataSource(filter: string): Observable<Array<ChallengeModel>> {
    const rawDataSource =  from(this.getChallengeList(filter));

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('challenge-list-state', rawDataSource);

    return cachedDataSource;
  }
  
  public getChallengeListStore(dataSource: Observable<Array<ChallengeModel>>): DataStore<Array<ChallengeModel>> {
    // Use cache if available
    if (!this.challengeListDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: Array<ChallengeModel> = [];
      this.challengeListDataStore = new DataStore(shellModel);

    }
      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.challengeListDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.challengeListDataStore.load(dataSource);
      }

    return this.challengeListDataStore;
  }

  async getChallengeList(filter?: string): Promise<Array<ChallengeModel>> {

    this.toggleIsLoadingChallengeList(true);
    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    const stringFilter = filter? `?filter[status]=${filter}`:'';


    return new Promise<Array<ChallengeModel>> ((resolve, reject) => {
      this.http.get(`${URL}/api/V1/users/challenges${stringFilter}`, requestOptions)
      .pipe(
        map((data:{status: string, message: string, data: Array<ChallengeModel>}) => {
          const list: Array<ChallengeModel> = data.data;
          return list;
        })
      )
      .subscribe(
        async resp => {
            const cha: ChallengeModel[] = resp;
            cha.forEach(async challenge => {

              challenge.picture= 'data:image/png;base64,' + challenge.picture;
             
              await this.activityServ.getActivityType(challenge.activity_type_id).then(
                (data:ActivityTypeModel)=> {
                  challenge.activity_type= data;
                }
              )
            });
            this.setChaList(cha);
            this.toggleIsLoadingChallengeList(false);
            resolve(this.challengeList);
        }, (error) => {
          this.toggleIsLoadingChallengeList(false);
          reject(error);
        }
      );
    });
  }

  /**
   * CHALLENGE
   */

  public async getChallengeDataSource(id:number): Promise<Observable<ChallengeModel>> {
    const rawDataSource =  from(this.getChallenge(id));

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('challenge-state', rawDataSource);

    return cachedDataSource;
  }
    
  public getChallengeStore(dataSource: Observable<ChallengeModel>): DataStore<ChallengeModel> {
    // Use cache if available
    if (!this.challengeDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: ChallengeModel = new ChallengeModel();
      this.challengeDataStore = new DataStore(shellModel);
    }

      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.challengeDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.challengeDataStore.load(dataSource);
      }

    return this.challengeDataStore;
  }

  async getChallenge(id: number): Promise<ChallengeModel> {
    this.toggleIsLoadingChallenge(true);
    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<ChallengeModel>((resolve, reject) => {
      
      this.http.get(`${URL}/api/V1/challenges/${id}`, requestOptions)
             .pipe(map(
               (data:{status:string,message:string,data:ChallengeModel})=>{
                 let challenge: ChallengeModel = data.data;
                 challenge.picture= 'data:image/png;base64, ' + challenge.picture;
                 console.log('challenge',challenge)
                 return challenge;
               }
             ))
       .subscribe( resp => {
          this.setChallenge(resp);
          this.toggleIsLoadingChallenge(false);
          resolve(resp);
       }, (error) => {
        this.toggleIsLoadingChallenge(false);
        reject(error);
      }
       );
    })
    
  }

  async joinChallenge(id: number) {
    let headerDict = {Authorization: await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return new Promise<boolean> ((resolve, reject) => {
      this.http.post(`${URL}/api/V1/users/challenges`, {
        challenge_id:id, status_id:1
      },requestOptions).subscribe(
        async resp => {
          resolve(true);
        }, (error) => {
          reject(error.error);
        }
        );
      });
    }
  
    // async getUserChallenge(id: number): Promise<UserChallengeModel> {
  
    //   let headerDict = {Authorization:  await this.authService.getToken()};
    //   const requestOptions = {                                                                                                                                                                                 
    //     headers: new HttpHeaders(headerDict), 
    //   };
  
    //   return new Promise<UserChallengeModel>((resolve, reject) => {
        
    //     this.http.get(`${URL}/api/V1/challenges/${id}`, requestOptions)
    //            .pipe(map(
    //              (data:{status:string,message:string,data:UserChallengeModel})=>{
    //                let challenge: UserChallengeModel = data.data;
    //                if (challenge && challenge.challenge && challenge.challenge.picture) {
                     
    //                  challenge.challenge.picture= 'data:image/png;base64, ' + challenge.challenge.picture;
    //                }
    //                return challenge;
    //              }
    //            ))
    //      .subscribe( resp => {
    //         this.setUserChallenge(resp);
    //         resolve(resp);
    //      }, (error) => {
    //       reject(error);
    //     }
    //      );
    //   })
      
    // }
  }
  