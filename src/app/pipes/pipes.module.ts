import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgFloorPipeModule } from 'angular-pipes';

import { TimeDifferencePipe } from './time-difference.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { FechaCortaPipe } from './fecha-corta.pipe';
import { FechaLargaPipe } from './fecha-larga.pipe';
import { HoraPipe } from './hora.pipe';
import { RoundNumberPipe } from './round-number.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NgFloorPipeModule
  ],
  declarations: [
    TimeDifferencePipe,
    TimeAgoPipe,
    ImageSanitizerPipe,
    FechaCortaPipe,
    FechaLargaPipe,
    HoraPipe,
    RoundNumberPipe
  ],
  exports: [
    NgFloorPipeModule,
    TimeDifferencePipe,
    TimeAgoPipe, ImageSanitizerPipe,FechaLargaPipe,FechaCortaPipe, HoraPipe, RoundNumberPipe
  ]
})
export class PipesModule {}
