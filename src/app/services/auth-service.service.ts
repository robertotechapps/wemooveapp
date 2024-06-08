import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../models/user-profile.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
import { environment } from '../../environments/environment';
import { resolve } from 'dns';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(public http: HttpClient) {  }

  async login(email: string, password: string , recordarme:boolean) {

    const data= {email, password, social_login:false};
    if (recordarme) {
      await this.guardarDatosLogin(email, password);
    } else{
      await this.borrarDatosLogin();
    }
    return new Promise<void> ((resolve, reject) => {
      this.http.post(`${URL}/api/V1/login`, data).subscribe(
        async resp => {
          await this.guardarToken(resp["data"].token_type +' '+resp["data"].access_token);
          resolve();
        }, (error) => {
          reject(error.error);
        }
        );
      });
  }

  async socialLogin(externalId: string) {

    const data= {externalId, social_login:true, password: externalId};

    return new Promise<void> ((resolve, reject) => {
      this.http.post(`${URL}/api/V1/socialLogin`, data).subscribe(
        async resp => {
          await this.guardarToken(resp["data"].token_type +' '+resp["data"].access_token);
          resolve();
        }, (error) => {
          reject(error.error);
        }
        );
      });
  }

  async forgotPassword(email: string) {

    return new Promise<void> ((resolve, reject) => {
      this.http.post(`${URL}/api/V1/resetPassword`, {email}).subscribe(
        async resp => {
          resolve();
        }, (error) => {
          reject(error);
        }
        );
      });
  }

  async verifyEmail(code: string, email:string) {

    return new Promise<boolean> ((resolve, reject) => {
      this.http.post(`${URL}/api/V1/verifyEmail`, {email:email, confirmation_code:code}).subscribe(
        async resp => {
          console.log('verifyEmail',resp);
          resolve(true);
        }, (error) => {
          reject(error.error);
        }
        );
      });
  }
  
  async resetPassword(code: string, email:string, password: string, confirmation:string) {
    
    return new Promise<boolean> ((resolve, reject) => {
      this.http.post(`${URL}/api/V1/newPassword`, {email:email, confirmation_code:code, password: password, password_confirmation: confirmation}).subscribe(
        async resp => {
          console.log('newPassword',resp);
          resolve(true);
        }, (error) => {
          reject(error.error);
        }
        );
      });
    }
    
    async deleteAccount() {
      
      let headerDict = {Authorization:  await this.getToken()};
      const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };

      return new Promise<boolean> ((resolve, reject) => {
        this.http.post(`${URL}/api/V1/deleteAccount`, requestOptions).subscribe(
          async resp => {
            resolve(true);
          }, (error) => {
            reject(error.error);
          }
          );
        });
    }

    async logout( ) {
  
    return new Promise (async (resolve) => {
      // const keys = (await Storage.keys()).keys;
      // if (keys.includes('tipoDoc')) {
      //   await Storage.remove({key:'usuario'});
      // } else {
      // }
      await Storage.clear();
      // this.setUsuario(null);
      resolve(true);
    });
  }

  async guardarDatosLogin( email: string, password: string) {
    await Storage.set({key:'email', value:email});
    await Storage.set({key:'password', value:password});

  }

  async getEmailLogin(): Promise<string> {
    let mail="";
    return await Storage.get({key:'email'}).then(val => {
      mail= val.value;
      return mail? mail: '';
    })
  }

  async getPasswordLogin(){
    return (await Storage.get({key:'password'})).value;
  }
  
  async guardarToken (token: string) {
    await Storage.set({key: 'token', value:token});
  }

  getToken () {
    return new Promise<string>((resolve, reject) => {
      
      Storage.get({ key: 'token' }).then(token =>{
        if(token.value)
          resolve(token.value);
        else
          resolve('');
      }
      );
    })
  }

  async borrarDatosLogin() {
    await Storage.remove({key:'email'});
    await Storage.remove({key:'password'});
  }

  signup(
    data: FormData) {
    this.guardarDatosLogin(data.get('email').toString(),data.get('password').toString());

      return new Promise<void> ((resolve, reject) => {
        this.http.post(`${URL}/api/V1/register`, data).subscribe(
          async resp => {
            console.log('signup',resp);
            // await this.verifyEmail(resp['data']['code'], resp['data']['email']);
            resolve();
          }, (error) => {
            reject(error.error);
          }
          );
      });
  }

  socialMediaSignup(firstname,lastname, password,password_confirmation,doc_type,doc_number,social_login,
    social_login_desc, cell,selfie,pic_doc_front,pic_doc_back,email,invitation_code
    ) {
      const data={firstname,lastname, password,password_confirmation,doc_type,doc_number,social_login,
        social_login_desc, cell,selfie,pic_doc_front,pic_doc_back,email, externalId: password, invitation_code};
    this.guardarDatosLogin(email,password);

      return new Promise<void> ((resolve, reject) => {
        this.http.post(`${URL}/api/V1/register`, data).subscribe(
          async resp => {
            console.log('signup',resp);
            resolve();
          }, (error) => {
            reject(error.error);
          }
          );
      });
  }
}
