import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'hora'
})
export class HoraPipe implements PipeTransform {

  transform(msgDate: any[]): string {
    moment.locale('es');
    if (msgDate) {
      var day = moment(msgDate, 'YYYY-MM-DD HH:mm').isValid()?
                moment(msgDate,'YYYY-MM-DD HH:mm') : moment(msgDate);

      return day.format('LT');
    }
  }

}
