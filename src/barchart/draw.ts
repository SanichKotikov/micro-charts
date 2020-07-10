import { IParams } from '../types';
import { pipe } from '../core';
import { clearCanvas, drawBars, drawFooter, drawRows } from '../draw';
import { IBarData, IOptions } from './types';

export function draw(params: IParams<IBarData, IOptions>) {
  const { canvas, options: { width, height } } = params;
  clearCanvas(canvas, width, height);
  pipe(drawRows, drawBars(), drawFooter)(params);
}
