import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityModel, ActivityTotalModel } from '../models/activity.model';
import { DataStore } from '../shell/data-store';
import { TransferStateHelper } from '../utils/transfer-state-helper';
import { AuthServiceService } from './auth-service.service';
import { ActivityTypeModel } from '../models/activity-type.model';
import { environment } from 'src/environments/environment';
import { FechaLargaPipe } from '../pipes/fecha-larga.pipe';

const URL = environment.url;


@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  
  private activityTypeListDataStore: DataStore<Array<ActivityTypeModel>>;
  private activityTypeDataStore: DataStore<ActivityTypeModel>;
  private activityTotalDataStore: DataStore<Array<ActivityTotalModel>>;

  private _activityTypeList: Array<ActivityTypeModel>;
  private activityTypeListSubject: BehaviorSubject<Array<ActivityTypeModel>>;
  public activityTypeList$: Observable<Array<ActivityTypeModel>>;
  
  private _activityType: ActivityTypeModel;
  private activityTypeSubject: BehaviorSubject<ActivityTypeModel>;
  public activityType$: Observable<ActivityTypeModel>;
  
  private _activityTotalList: Array<ActivityTotalModel>;
  private activityTotalListSubject: BehaviorSubject<Array<ActivityTotalModel>>;
  public activityTotalList$: Observable<Array<ActivityTotalModel>>;

  //User activity
  private activityListDataStore: DataStore<Array<ActivityModel>>;
  private activityDataStore: DataStore<ActivityModel>;
  
  private _activityList: Array<ActivityModel>;
  private activityListSubject: BehaviorSubject<Array<ActivityModel>>;
  public activityList$: Observable<Array<ActivityModel>>;
  
  private _activity: ActivityModel;
  private activitySubject: BehaviorSubject<ActivityModel>;
  public activity$: Observable<ActivityModel>;

  fechaLargaPipe = new FechaLargaPipe();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferStateHelper: TransferStateHelper,
    private http: HttpClient,
    private authService: AuthServiceService
  ) { 
    this.activityTypeListSubject = new BehaviorSubject<Array<ActivityTypeModel>>(this._activityTypeList);
    this.activityTypeList$ = this.activityTypeListSubject.asObservable();
    
    this.activityTotalListSubject = new BehaviorSubject<Array<ActivityTotalModel>>(this._activityTotalList);
    this.activityTotalList$ = this.activityTotalListSubject.asObservable();

    this.activityTypeSubject = new BehaviorSubject<ActivityTypeModel>(this._activityType);
    this.activityType$ = this.activityTypeSubject.asObservable();

    this.activityListSubject = new BehaviorSubject<Array<ActivityModel>>(this._activityList);
    this.activityList$ = this.activityListSubject.asObservable();
    
    this.activitySubject = new BehaviorSubject<ActivityModel>(this._activity);
    this.activity$ = this.activitySubject.asObservable();
  }

  public setActivityTypeList(actList: Array<ActivityTypeModel>) {
    if (!actList) {
      actList= [];
    }

    this.activityTypeListSubject.next(actList);
  }

  public setActivityTotalList(actList: Array<ActivityTotalModel>) {
    if (!actList) {
      actList= [];
    }

    this.activityTotalListSubject.next(actList);
  }

  public setActivityList(actList: ActivityModel[]) {
    if (!actList) {
      actList= [];
    }

    this.activityListSubject.next(actList);
  }

  public setActivityType(item: ActivityTypeModel) {
    if (!item) {
      item= null;
    }

    this.activityTypeSubject.next(item);
  }

  public setActivity(item: ActivityModel) {
    if (!item) {
      item= null;
    }

    this.activitySubject.next(item);
  }
  
  /**
   * get activity type list
   */
  public get activityTypeList() {
    return this.activityTypeListSubject.value;
  }

  public get activityTotalList() {
    return this.activityTotalListSubject.value;
  }

  public get activityList() {
    return this.activityListSubject.value;
  }

  public get activityType() {
    return this.activityTypeSubject.value;
  }

  public get activity() {
    return this.activitySubject.value;
  }

  /**
   * ACTIVITY TYPE LIST
   */
  public getActivityTypeListDataSource(): Observable<Array<ActivityTypeModel>> {
    const rawDataSource = from(this.getActivityTypeList());

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('activity-type-list-state', rawDataSource);

    return cachedDataSource;
  }

  public getActivityTypeListStore(dataSource: Observable<ActivityTypeModel[]>): DataStore<ActivityTypeModel[]> {
    // Use cache if available
    if (!this.activityTypeListDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: ActivityTypeModel[] = [new ActivityTypeModel()];
      this.activityTypeListDataStore = new DataStore(shellModel);

    }
      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.activityTypeListDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.activityTypeListDataStore.load(dataSource);
      }

    return this.activityTypeListDataStore;
  }

  getActivityTypeList$(token: string): Observable<Array<ActivityTypeModel>> {

    let headerDict = {Authorization:  token};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return this.http.get(`${URL}/api/V1/activitiesTypes`, requestOptions)
      .pipe( map( (data:{status:string,message:string,data:Array<ActivityTypeModel>}) => {
        const resp: Array<ActivityTypeModel> = data.data;
        resp.forEach( actType => {
          actType.icon= 'data:image/png;base64, '+ actType.icon;
        })
        return resp;
      }));
  }
  async getActivityTypeList(): Promise<Array<ActivityTypeModel>> {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<Array<ActivityTypeModel>> ((resolve, reject) => {
      this.http.get(`${URL}/api/V1/activitiesTypes`, requestOptions)
      .pipe( map( (data:{status:string,message:string,data:Array<ActivityTypeModel>}) => {
        const resp: Array<ActivityTypeModel> = data.data;
        resp.forEach( actType => {
          actType.icon= 'data:image/png;base64, '+ actType.icon;
        })
        return resp;
      }))
      .subscribe(
        resp => {
          this.setActivityTypeList(resp);
          resolve(this.activityTypeList);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

   /**
   * ACTIVITY TYPE
   */

    public async getActivityTypeDataSource(): Promise<Observable<ActivityTypeModel>> {
      const rawDataSource = this.activityType$;
  
      // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
      // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
      // duplicate http requests.
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('activity-type-state', rawDataSource);
  
      return cachedDataSource;
    }
  
    public getActivityTypeStore(dataSource: Observable<ActivityTypeModel>): DataStore<ActivityTypeModel> {
      // Use cache if available
      if (!this.activityTypeDataStore) {
        // Initialize the model specifying that it is a shell model
        const shellModel: ActivityTypeModel = new ActivityTypeModel();
        this.activityTypeDataStore = new DataStore(shellModel);
      }
  
        // If running in the server, then don't add shell to the Data Store
        // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
        if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
          // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
          this.activityTypeDataStore.load(dataSource, 0);
        } else { // On browser transitions
          // Trigger the loading mechanism (with shell)
          this.activityTypeDataStore.load(dataSource);
        }
  
      return this.activityTypeDataStore;
    }

    async getActivityType(id: number): Promise<ActivityTypeModel> {

      let headerDict = {Authorization:  await this.authService.getToken()};
      const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };

      return new Promise<ActivityTypeModel>((resolve, reject) => {
        
        this.http.get(`${URL}/api/V1/activitiesTypes/${id}`, requestOptions)
              .pipe(map(
                (data:{status:string,message:string,data:ActivityTypeModel})=>{
                  data.data.icon= 'data:image/png;base64, ' + data.data.icon;
                  console.log(data);
                  return data.data;
                }
              ))
        .subscribe( resp => {
          this.setActivityType(resp);
          resolve(this.activityType);
        }, (error) => {
          reject(error);
        }
        );
      })
    }

  /**
   * USER ACTIVITY LIST
   */
  public async getActivityListDataSource(): Promise<Observable<Array<ActivityModel>>> {
    const rawDataSource = this.activityList$;

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('activity-list-state', rawDataSource);

    return cachedDataSource;
  }

  public getActivityListStore(dataSource: Observable<Array<ActivityModel>>): DataStore<Array<ActivityModel>> {
    // Use cache if available
    if (!this.activityListDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: Array<ActivityModel> = [new ActivityModel()];
      this.activityListDataStore = new DataStore(shellModel);

    }
      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.activityListDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.activityListDataStore.load(dataSource);
      }

    return this.activityListDataStore;
  }

  async getUserActivities(filter?: string) {

    if (!filter) {
      filter='total'
    }
    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<ActivityModel[]> ((resolve, reject) => {
      this.http.get(`${URL}/api/V1/users/activities?filter[when]=${filter}`, requestOptions)
      .pipe(
        map( (data:{status:string,message:string,data:ActivityModel[]}) => {
          const usrActivities: ActivityModel[] = data.data;
          return usrActivities;
        })
      )
      .subscribe(
        async resp => {
            const act: ActivityModel[] = resp;
            const hoy= new Date(Date.now());
            const hoyFormatted=hoy.getFullYear().toString()+'-'+hoy.getMonth().toString()+'-'+hoy.getDay().toString();
            act.forEach(async activity => {
                  let actType = this.activityTypeList?.find(item => item.id === activity.activity_type_id);
                  activity.activity_type= actType?? await this.getActivityType(activity.activity_type_id);
                  let esHoy = activity.start_date === hoyFormatted ;
                  const fechaLarga= this.fechaLargaPipe.transform(activity.start_date);
                  activity={esHoy, fechaLarga: fechaLarga.substr(0,fechaLarga.length-5) , ...activity};
                  console.log(activity);
                });
            // this.setActivityList(act);
            resolve(act);
        }, (error) => {
          reject(error);
        }
      );
    });
    
  }


/** LAST ACTIVITY */
async getLastUserActivity() {

  let headerDict = {Authorization:  await this.authService.getToken()};
  const requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(headerDict), 
  };

  return new Promise<ActivityModel> ((resolve, reject) => {
    this.http.get(`${URL}/api/V1/users/activities?filter[when]=last`, requestOptions)
    .pipe(
      map( (data:{status:string,message:string,data:ActivityModel}) => {
        const usrActivities: ActivityModel = data.data;
        return usrActivities;
      })
    )
    .subscribe(
      async resp => {
      if(resp !== null)
        {
          let act: ActivityModel = resp;
          const hoy= new Date(Date.now());
          const hoyFormatted=hoy.getFullYear().toString()+'-'+hoy.getMonth().toString()+'-'+hoy.getDay().toString();

          let actType = this.activityTypeList?.find(item => item.id === act.activity_type_id);
          act.activity_type= actType?? await this.getActivityType(act.activity_type_id);
          let esHoy = act.start_date === hoyFormatted ;
          const fechaLarga= this.fechaLargaPipe.transform(act.start_date);
          act={esHoy, fechaLarga: fechaLarga.substr(0,fechaLarga.length-5) , ...act};
          console.log(act);
             

          resolve(act);
        }
        else{
         resolve(null);
         console.log("activity NULL");
        }

      }, (error) => {
        reject(error);
      }
    );
  });
  
}


   /**
   * USER ACTIVITY
   */

    public async getActivityDataSource(): Promise<Observable<ActivityModel>> {
      const rawDataSource = this.activity$;
  
      // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
      // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
      // duplicate http requests.
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('activity-state', rawDataSource);
  
      return cachedDataSource;
    }
  
    public getActivityStore(dataSource: Observable<ActivityModel>): DataStore<ActivityModel> {
      // Use cache if available
      if (!this.activityDataStore) {
        // Initialize the model specifying that it is a shell model
        const shellModel: ActivityModel = new ActivityModel();
        this.activityDataStore = new DataStore(shellModel);
  
      }
        // If running in the server, then don't add shell to the Data Store
        // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
        if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
          // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
          this.activityDataStore.load(dataSource, 0);
        } else { // On browser transitions
          // Trigger the loading mechanism (with shell)
          this.activityDataStore.load(dataSource);
        }
  
      return this.activityDataStore;
    }

    async getUserActivity(id: number): Promise<ActivityModel> {

      let headerDict = {Authorization:  await this.authService.getToken()};
      const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };

      return new Promise<ActivityModel>((resolve, reject) => {
        
        this.http.get(`${URL}/api/V1/users/activities/${id}`, requestOptions)
              .pipe(map(
                (data:{status:string,message:string,data:ActivityModel})=>{
                  const usrActivity: ActivityModel = data.data;
                  return usrActivity;
                }
              ))
        .subscribe( async resp => {
          let act: ActivityModel = resp;
          const hoy= new Date(Date.now());
          const hoyFormatted=hoy.getFullYear().toString()+'-'+hoy.getMonth().toString()+'-'+hoy.getDay().toString();

          let actType = this.activityTypeList?.find(item => item.id === act.activity_type_id);
          act.activity_type= actType?? await this.getActivityType(act.activity_type_id);
          let esHoy = act.start_date === hoyFormatted ;
          const fechaLarga= this.fechaLargaPipe.transform(act.start_date);
          act={esHoy, fechaLarga: fechaLarga.substr(0,fechaLarga.length-5) , ...act};
          resolve(act);
        }, (error) => {
          reject(error);
        }
        );
      })
    }

   /**
   * ACTIVITY TOTAL LIST
   */
  public async getActivityTotalListDataSource(): Promise<Observable<Array<ActivityTotalModel>>> {
    const rawDataSource = this.activityTotalList$;

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('activity-total-list-state', rawDataSource);

    return cachedDataSource;
  }

  public getActivityTotalListStore(dataSource: Observable<ActivityTotalModel[]>): DataStore<ActivityTotalModel[]> {
    // Use cache if available
    if (!this.activityTotalDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: ActivityTotalModel[] = [new ActivityTotalModel()];
      this.activityTotalDataStore = new DataStore(shellModel);

    }
      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.activityTotalDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.activityTotalDataStore.load(dataSource);
      }

    return this.activityTotalDataStore;
  }

  async getActivityTotalList(filter?: string): Promise<Array<ActivityTotalModel>> {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    if (!filter) {
      filter='total'
    }
    
    return new Promise<Array<ActivityTotalModel>> ((resolve, reject) => {
      this.http.get(`${URL}/api/V1/users/getTotalActivities?filter[period]=${filter}`, requestOptions)
      .pipe( map( (data:{status:string,message:string,data:Array<ActivityTotalModel>}) => {
        const resp: Array<ActivityTotalModel> = data.data;
        return resp;
      }))
      .subscribe(
        resp => {
          this.setActivityTotalList(resp);
          resolve(this.activityTotalList);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

    async saveActivityUser(activity_type_id: number, user_id:number, start_date: string, end_date: string, 
      total_duration: string, total_distance:string, total_calories: string, challenge_id: number,
      challenge_completed: boolean, route: string) {
      let headerDict = {Authorization:  await this.authService.getToken()};
      const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
      return new Promise<any> ((resolve, reject) => {
        this.http.post(`${URL}/api/V1/users/activities`, {
          activity_type_id,user_id,start_date ,end_date,total_duration, total_distance, total_calories,challenge_id,
          challenge_completed, route
        },requestOptions).subscribe(
          async resp => {
            console.log('save activity',resp);
            const res: any = resp;
            
            resolve(res);
          }, (error) => {
            reject(error.error);
          }
          );
        });
    }

}
