import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { takeUntil, timeInterval } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { interval, Observable, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-count-down-comp',
  templateUrl: './count-down-comp.component.html',
  styleUrls: ['./count-down-comp.component.scss'],
})
export class CountDownCompComponent implements OnInit {

  _endingTime: any;
  _initialUnit = 'second';
  _endingUnit = 'second';
  strokeDashoffset='440';
  initialOffset: number = 440;

  _updateInterval: Observable<any> = interval(1000);
  private _unsubscribeSubject: Subject<void> = new Subject();

  _secondsLeft: string;

  // MODULUS

  _secondModulus = (secondsLeft) => secondsLeft;interval: NodeJS.Timeout;
;

  

  // counter = 0;
  // interval: NodeJS.Timeout;
  // countdownDate: string ;
    
    constructor(private modalCtrl: ModalController,@Inject(PLATFORM_ID) private platformId: object) { 
    // clearInterval(this.interval);
    // this.countdownDate = dayjs().add(5, 'second').format('MM/DD/YYYY HH:mm:ss') as string;
    this._initialUnit = 'second';
    this._endingUnit = 'second';
  }
  
  
  ngOnInit(){
    // this.strokeDashoffset =(this.initialOffset-((4)*(this.initialOffset/4))).toString();

    console.log('strokeDash',this.strokeDashoffset);
    
    this._endingTime = dayjs().add(5, 'second').format('MM/DD/YYYY HH:mm:ss') as string;
    if (isPlatformBrowser(this.platformId)) {
      this._updateInterval.pipe(takeUntil(this._unsubscribeSubject)).subscribe(
        (val) => {
          this.updateValues();
        },
        (error) => console.error(error),
        () => console.log('[takeUntil] complete')
      );
    } else {

      
      this.interval = setInterval(async ()=>{
        this.updateValues();
      }, 1000);
    }

  }

  updateValues(): void {
    const secondsLeft = dayjs(this._endingTime).diff(dayjs(), 'second');

    this.strokeDashoffset =(this.initialOffset-((4-secondsLeft)*(this.initialOffset/3))).toString();
        console.log('strokeDash',this.strokeDashoffset);

    let aux =Math.floor(this._secondModulus(secondsLeft));
    this._secondsLeft = aux==0? 'GO!': aux.toString();
    if (aux <= 0) {
      clearInterval(this.interval);
      this._unsubscribeSubject.next();
      this._unsubscribeSubject.complete();
      this.modalCtrl.dismiss();
    }
  }
}
