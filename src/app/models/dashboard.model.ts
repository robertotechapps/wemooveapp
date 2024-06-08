import { ShellModel } from '../shell/data-store';
import { UserModel } from './user-profile.model';
import { ChallengeModel } from './challenge.model';
import { ActivityTypeModel } from './activity-type.model';

export class DashboardModel extends ShellModel {
    user: UserModel;
    curUserChallenge: ChallengeModel;
    activities: ActivityTypeModel[];
}