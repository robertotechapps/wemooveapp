import { ShellModel } from '../shell/data-store';

export class CharityModel extends ShellModel {

    balance: number;
    cause: string;
    email: string;
    web: string;
    id: number;
    logo: string;
    min_withdrawal_amount: number;
    name: string;
    objectives: string;
    total_donations: number;

    constructor() {
        super();
    }
}

export class UserCharityModel extends ShellModel {
    charity: {
        balance: number;
        cause: string;
        created_at: Date;
        email: string;
        id: number;
        name: string;
        objectives: string;
        updated_at: Date;
        user_id: number;
    };
    picture: string;
    today_total_donations: number;
    total_donations: number;
    queried: boolean= false;

    constructor(){
        super();
    }
}