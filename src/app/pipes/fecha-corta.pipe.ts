import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fechaCorta'
})
export class FechaCortaPipe implements PipeTransform {

  transform(msgDate: string): string {
    moment.locale('es');
    if (msgDate) {
      var day;
      if (msgDate.toString().split('/')[0].length==4) {
        
        day = moment(msgDate, 'YYYY-MM-DD HH:mm').isValid()?
                  moment(msgDate,'YYYY-MM-DD HH:mm') : moment(msgDate);
      } else{
        day = moment(msgDate, 'DD/MM/YYYY HH:mm').isValid()?
                moment(msgDate,'DD/MM/YYYY HH:mm') : moment(msgDate);
      }
      return day.format('L');
    }
  }

}
