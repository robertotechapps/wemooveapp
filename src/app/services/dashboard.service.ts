import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardModel } from '../models/dashboard.model';
import { DataStore } from '../shell/data-store';
import { TransferStateHelper } from '../utils/transfer-state-helper';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private dashboardDataStore: DataStore<DashboardModel>;


  constructor(
    private http: HttpClient,
    private transferStateHelper: TransferStateHelper,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  public getDashboardDataSource(): Observable<DashboardModel> {
    const rawDataSource = this.http.get<DashboardModel>('./assets/sample-data/activity/activity.json')
    .pipe(
      map(
        (data: DashboardModel) => {
          // Note: HttpClient cannot know how to instantiate a class for the returned data
          // We need to properly cast types from json data
          const activity = new DashboardModel();

          // The Object.assign() method copies all enumerable own properties from one or more source objects to a target object.
          // Note: If you have non-enummerable properties, you can try a spread operator instead. profile = {...data};
          // (see: https://scotch.io/bar-talk/copying-objects-in-javascript#toc-using-spread-elements-)
          Object.assign(activity, data);

          return activity;
        }
      )
    );

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    const cachedDataSource = this.transferStateHelper.checkDataSourceState('activity-state', rawDataSource);

    return cachedDataSource;
  }

  public getDashboardStore(dataSource: Observable<DashboardModel>): DataStore<DashboardModel> {
    // Use cache if available
    if (!this.dashboardDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: DashboardModel = new DashboardModel();
      this.dashboardDataStore = new DataStore(shellModel);

    }
      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.dashboardDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.dashboardDataStore.load(dataSource);
      }

    return this.dashboardDataStore;
  }
}
