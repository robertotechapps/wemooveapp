import { Resolve } from '@angular/router';
 import { DataStore } from 'src/app/shell/data-store';
 import { Observable } from 'rxjs';
 import { UserModel, UserDashboardModel, TotalAmountsModel, UserDetailModel } from '../../models/user-profile.model';
 import { UserService } from '../../services/user.service';
 import { ActivityTypeModel } from 'src/app/models/activity-type.model';
 import { ActivityService } from '../../services/activity.service';
 import { Injectable } from '@angular/core';
 import { ActivityModel, TodayTotalActivityModel } from '../../models/activity.model';
 import { AuthServiceService } from 'src/app/services/auth-service.service';
 import { UserCharityModel } from '../../models/charity.model';
 import { UserChallengeModel } from '../../models/challenge.model';

 @Injectable()
 export class SelectActivityResolver implements Resolve<any>{

    constructor(private usrService: UserService, private activityServ: ActivityService, private authServ: AuthServiceService){}

    resolve(){
      const userDataSource: Observable<UserDetailModel> = this.usrService.getUserDashboardDataSource();
      const userDataStore: DataStore<UserDetailModel> = this.usrService.getUserDashboardStore(userDataSource);

      const totalAmountDataSource: Observable<TotalAmountsModel> = this.usrService.getUserTotalAmountDataSource();
      const totalAmountDataStore: DataStore<TotalAmountsModel> = this.usrService.getUserTotalAmountStore(totalAmountDataSource);

      const charityDataSource: Observable<UserCharityModel> = this.usrService.getUserCharityDataSource();
      const charityDataStore: DataStore<UserCharityModel> = this.usrService.getUserCharityStore(charityDataSource);

      const challengeDataSource: Observable<void|UserChallengeModel> = this.usrService.getUserChallengeDataSource();
      const challengeDataStore: DataStore<void|UserChallengeModel> = this.usrService.getUserChallengeStore(challengeDataSource);

      const activityTypeListDataSource: Observable<Array<ActivityTypeModel>> = this.activityServ.getActivityTypeListDataSource();
      const activityTypeListDataSotore: DataStore<Array<ActivityTypeModel>> = this.activityServ.getActivityTypeListStore(activityTypeListDataSource);

      const todayTotalActivityDataSource: Observable<Array<ActivityModel>> = this.usrService.getTodayTotalActivityDataSource();
      const todayTotalActivityDataSotore: DataStore<Array<ActivityModel>> = this.usrService.getTodayTotalActivityStore(todayTotalActivityDataSource);

      return {
              totalAmount: totalAmountDataStore, 
              charity: charityDataStore,
              challenge: challengeDataStore,
              activityTypeList: activityTypeListDataSotore, 
              todayTotalActivity: todayTotalActivityDataSotore};
    }
 }