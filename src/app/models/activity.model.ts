import { Time } from '@angular/common';
import { ShellModel } from '../shell/data-store';
import { ActivityTypeModel } from './activity-type.model';

export class ActivityModel extends ShellModel {
  id: number = 0;
  activity_type_id: number = 0;
  start_date: string = null;
  end_date: string = null;
  total_duration: string = null;
  total_distance: string = null;
  total_calories: string = null;
  challenge_id: number = 0;
  created_at: Date = null;
  updated_at: Date = null;
  challenge_completed: number = 0;
  fechaLarga: string = null;
  esHoy:boolean = null;
  activity_type: ActivityTypeModel= null;
  totalCoins: number = 0;
  total_earn: string=null;
  total_coins: string=null;
    constructor() {
      super();
    }
  route: string;
}

export class TodayTotalActivityModel extends ShellModel {
  firstActivityDate: Date = null;
  total_calories: number = 0;
  total_earn: number = 0;
  total_coins: number = 0;
  avg_calories: number = 0;
  activityList: Array<any> = [];
  
    constructor() {
      super();
    }
}

export class TodayActivityModel extends ShellModel {
  activity_type_id: number = 0;
  activity_type_name: string = null;
  total_calories: number = 0;
  icon: string= null;
    constructor() {
      super();
    }
}

export class ActivityTotalModel extends ShellModel {
  id: number =0;
  name: string='';
  icon: string='';
  map: boolean= false;
  created_at: Date=new Date(Date.now()) ;
  updated_at: Date=new Date(Date.now());
  deleted_at: Date = null;
  description: string = "";
  totals: {
      total_distance: number;
      total_duration: number;
      total_calories: number;
  };
  url_icon: string='';
    constructor() {
      super();
    }
}
