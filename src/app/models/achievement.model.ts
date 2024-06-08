import { ShellModel } from '../shell/data-store';
import { ActivityTypeModel } from 'src/app/models/activity-type.model';

export class AchievementModel extends ShellModel {
    id: number;
    name: string;
    fecha: Date;
    url_icon: string;
    activity_type_id: number;
    measure_unit_id: number;
    calories: number;
    target: number;
    amount: number;
    available: boolean;
    activity_type: ActivityTypeModel;
    constructor() {
        super();
      }
}
