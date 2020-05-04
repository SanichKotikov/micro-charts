import { IParams } from '../types';
import { pipe } from '../core';
import { clearCanvas, drawRows, drawBars, drawChartFill, drawChartLine, drawFooter } from '../draw';
import { IData, IOptions } from './types';

export function draw(params: IParams<IData, IOptions>) {
  const { canvas, options: { width, height } } = params;
  clearCanvas(canvas, width, height);
  pipe(drawRows, drawChartFill, drawChartLine, drawBars(1), drawFooter)(params);
}