import { ShellModel } from '../shell/data-store';
import { ActivityTypeModel } from './activity-type.model';
import { CharityModel } from './charity.model';

export class ChallengeModel extends ShellModel {
    id: number = 0;
    name: string= null;
    activity_type_id: number = 0;
    target_duration: number = 0;
    target_distance: number = 0;
    target_calories: number = 0;
    public_init_date: Date= null;
    public_end_date: Date= null;
    timeframe: number = 0;
    coin_award: number = 0;
    created_at: Date= null;
    updated_at: Date= null;

    deleted_at: string;
    description: string;
    picture: string;
    charity_id: number = 0;
    available: boolean= false;
    header_color: string;
    background: string;
    footer_color: string;
    activity_type: ActivityTypeModel=new ActivityTypeModel();
    picture_url:string;
    // challenge: unknown;
    // userChallenge: UserChallengeModel=new UserChallengeModel();
    constructor() {
        super();
      }
}

export class UserChallengeModel extends ShellModel {
  challenge: ChallengeModel= new ChallengeModel();
  totalUsersCompleteChallenge: number=0;
  left_time_minutes: number=0;
  leftHours: string='0';
  today_total_donations: number = 0;
  total_donations: number = 0;
  progress: ChallengeProgressModel= new ChallengeProgressModel();
  user_id: number=0;
  challenge_id: number=0;
  status_id: number=0;
  created_at: Date=null;
  updated_at: Date=null;
  queried: boolean=false;

  constructor() {
      super();
    }
}

export class ChallengeProgressModel extends ShellModel {
  total_calories: number=0;
  total_distance: number=0;
  total_duration: number=0;
  constructor() {
      super();
    }
}