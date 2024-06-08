import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { ActivityService } from '../../services/activity.service';
import { ActivityTypeModel } from '../../models/activity-type.model';
import { UserDetailModel, UserModel } from 'src/app/models/user-profile.model';
import { UserService } from 'src/app/services/user.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Injectable()
export class ActivityInProgressResolver implements Resolve<any> {

  constructor(private activityService: ActivityService,private usrService: UserService,private authServ: AuthServiceService) { }

  async resolve(){
    const token = await this.authServ.getToken();
    const userDataSource: Observable<UserDetailModel> = this.usrService.getUserDashboardDataSource(token);
    const userDataStore: DataStore<UserDetailModel> = this.usrService.getUserDashboardStore(userDataSource);

    const dataSource: Observable<ActivityTypeModel> = await this.activityService.getActivityTypeDataSource();
    const dataStore: DataStore<ActivityTypeModel> = this.activityService.getActivityTypeStore(dataSource);

    return {user: userDataStore, activityType:dataStore};
  }
}
