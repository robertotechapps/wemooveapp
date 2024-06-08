import { ShellModel } from '../shell/data-store';

export class ActivityTypeModel extends ShellModel{
    id: number=0;
    name: string='';
    map: boolean=false;
    description: string='';
    icon: string='';
    coefficient: number=0;
    mets_table: Array<MetModel>=[];
    constructor() {
        super();
      }
}

export class MetModel {
  id: number =0;
  activity_type_id: number=0;
  avg_speed: number=0;
  met:number=0;
}