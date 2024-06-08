import { Resolve } from '@angular/router';
import { DataStore } from 'src/app/shell/data-store';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/user-profile.model';
import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable()
export class WalkthoughResolver implements Resolve<DataStore<UserModel>>{

    constructor(private usrService: UserService, private authServ: AuthServiceService){}

    async resolve() {
        const token = await this.authServ.getToken();

        const userDataSource: Observable<UserModel> = await this.usrService.getUserDataSource(token);
        const userDataStore: DataStore<UserModel> = this.usrService.getUserStore(userDataSource);

        return userDataStore;
    }
}