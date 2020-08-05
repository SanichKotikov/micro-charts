import type { IParams } from '../types';
import { pipe } from '../core';
import { clearCanvas, drawBars, drawChartFill, drawChartLine, drawFooter, drawRows } from '../draw';
import type { IData, IOptions } from './types';

export function draw(params: IParams<IData, IOptions>) {
  const { canvas, options: { width, height } } = params;
  clearCanvas(canvas, width, height);
  pipe(drawChartFill, drawRows, drawChartLine, drawBars(1), drawFooter)(params);
}
