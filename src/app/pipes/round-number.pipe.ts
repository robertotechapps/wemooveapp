import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundNumber'
})
export class RoundNumberPipe implements PipeTransform {

  transform(value: number, decimals: number): number {
    const auxNumbRounded=Math.round(value * decimals);
    const toDecimals= auxNumbRounded==0? 0: auxNumbRounded/ decimals;
    return toDecimals;
  }

}
