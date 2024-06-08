import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AchievementModel } from '../models/achievement.model';
import { AuthServiceService } from './auth-service.service';
import { environment } from '../../environments/environment';
import { ActivityService } from './activity.service';
import { map } from 'rxjs/operators';
import { ActivityTypeModel } from '../models/activity-type.model';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  
  private curAchievementList:AchievementModel[];
  private currentAchievementListSubject: BehaviorSubject<AchievementModel[]>;
  public currentAchievementList: Observable<AchievementModel[]>;

  constructor(private authService: AuthServiceService,
    private activityServ: ActivityService,
    private http: HttpClient) { 
      this.currentAchievementListSubject = new BehaviorSubject<AchievementModel[]>(this.curAchievementList);
    this.currentAchievementList = this.currentAchievementListSubject.asObservable();
    }

  public setAchList(achList: AchievementModel[]) {
    if (!achList) {
      achList= [];
    }

    this.currentAchievementListSubject.next(achList);
  }

  public get achievementList() {
    return this.currentAchievementListSubject.value;
  }

  async getAchievements() {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<void> ((resolve, reject) => {
      this.http.get<AchievementModel[]>(`${URL}/api/V1/users/achievements`, requestOptions).subscribe(
        async resp => {
            const ach: any[] = resp['data'];
            let achList: Array<AchievementModel>=[];
            ach.forEach(async achievement => {   
              achievement['icon'] = 'data:image/png;base64, ' + achievement['iconBase64']
            });
            this.setAchList(ach);
            resolve();
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async getAchievement<AchievementModel>(id: number) {

    let headerDict = {Authorization:  await this.authService.getToken()};
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return new Promise<AchievementModel>((resolve, reject) => {
      
      this.http.get<AchievementModel>(`${URL}/api/V1/achievements/${id}`, requestOptions)
             .pipe(map(
               (data:AchievementModel)=>{
                 data['data'].icon= './assets/achievements/' + data['data'].icon;
                 console.log(data);
                 return data;
               }
             ))
       .subscribe( resp => {

         resolve(resp['data']);
       }, (error) => {
        reject(error);
      }
       );
    })
    
  }
}
