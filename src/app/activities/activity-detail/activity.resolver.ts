import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { ActivityModel } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';

@Injectable()
export class ActivityResolver implements Resolve<DataStore<ActivityModel>> {

  constructor(private activityService: ActivityService) { }

  async resolve(): Promise<DataStore<ActivityModel>> {
    const dataSource: Observable<ActivityModel> = await this.activityService.getActivityDataSource();
    const dataStore: DataStore<ActivityModel> = this.activityService.getActivityStore(dataSource);

    return dataStore;
  }
}
