import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { ActivityModel } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';

@Injectable()
export class ActivityListResolver implements Resolve<DataStore<Array<ActivityModel>>> {

  constructor(private activityService: ActivityService) { }

  async resolve(): Promise<DataStore<Array<ActivityModel>>> {
    const dataSource: Observable<Array<ActivityModel>> = await this.activityService.getActivityListDataSource();
    const dataStore: DataStore<Array<ActivityModel>> = this.activityService.getActivityListStore(dataSource);

    return dataStore;
  }
}
