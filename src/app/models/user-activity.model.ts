import { ShellModel } from '../shell/data-store';
import { ActivityTypeModel } from './activity-type.model';

export class UserActivityModel extends ShellModel{
    activity_type_id: number;
    user_id: number;
    start_date: Date;
    end_date: Date;
    total_duration: number;
    total_distance: number;
    total_calories: number;
    challenge_id: number;

    //refs
    activityType: ActivityTypeModel;
    
}