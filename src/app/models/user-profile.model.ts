
import { ShellModel } from '../shell/data-store';
import { ActivityTypeModel } from './activity-type.model';
import { ChallengeModel, UserChallengeModel } from './challenge.model';
import { AchievementModel } from './achievement.model';
import { UserCharityModel } from './charity.model';
import { Time } from '@angular/common';

export class UserModel extends ShellModel {
  id: number;
  firstname: string='';
  lastname: string='';
  balance: number;
  email: string='';
  doc_type: string='';
  doc_number: string='';
  sex: string='';
  height: number=0;
  weight: number=0;
  imc:number=0;
  cell: string='';
  measure_unit: string='';
  country: string='';
  lenguage: string='';
  entity_id: number=0;

  birth_date: Date=null;
  avatar: string='';
  created_at: Date=null;
  
  activityList: ActivityTypeModel[]=[];
  currentChallenge: UserChallengeModel=null;
  achievementList: AchievementModel[]=[];
  charity: UserCharityModel=null;

  //datos conexion o userContext
  plataforma: string='';
  fechaUltimoUso: Date=null;
  versionInstalada: string='';
  lastLoginTime: string;
  totalLogros: string='0';
  totalDesafios: string='0';
  totalActividades: string='0';
  totalDistancia: string='0';
  totalUsd: string='0';
  totalCalorias: number=0;
  totalTiempo: number=0;
  totalCoins: number=0; //calculado con la cotizacion y los dolares
  cotizacion: number=0;
  todayCalories: number = 0;
  todayCoins: number = 0;
  todayEarns: number = 0;
  constructor() {
    super();

  }

}

export class UserDetailModel extends ShellModel {
  id: number=0;
  firstname: string='';
  lastname: string='';
  balance: number;
  email: string='';
  doc_type: string='';
  doc_number: string='';
  sex: string='';
  height: number=0;
  weight: number=0;
  imc:number=0;
  cell: string='';
  measure_unit: string='';
  country: string='';
  lenguage: string='';
  entity_id: number=0;

  birth_date: Date=null;
  avatar: string='';
  created_at: Date=null;
  lastLoginTime: string=null;
minimal_amount: number=0;
  totalAmounts: any=null;
  account_id: string="";
  constructor() {
    super();

  }

}

export class UserDashboardModel extends ShellModel{
  userDetail: UserDetailModel=new UserDetailModel();
  totalAmounts: TotalAmountsModel= new TotalAmountsModel();
  currentChallenge: UserChallengeModel=new UserChallengeModel();
  charity: UserCharityModel= new UserCharityModel();
  
  constructor() {
    super();

  }

}

export class TotalAmountsModel extends ShellModel {
  totalUsd: string='0';
  cotizacion: number=0;
  totalDesafios: string='0';
  totalLogros: string='0';
  totalActividades: string='0';
  totalCalorias: number=0;
  totalDistancia: string='0';
  totalTiempo: number=0;
  totalCoins: number=0; //calculado con la cotizacion y los dolares
  todayCalories: number = 0;
  todayCoins: number = 0;
  todayEarns: number = 0;
  avgCalories: number = 0;
  
  constructor() {
    super();

  }

}
