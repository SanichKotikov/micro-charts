import type { IParams } from '../types';
import { pipe } from '../core';
import { clearCanvas, drawChartFill, drawChartLine, drawFooter, drawRows } from '../draw';
import type { ILineData, IOptions } from './types';

export function draw(params: IParams<ILineData, IOptions>) {
  const { canvas, options: { width, height } } = params;
  clearCanvas(canvas, width, height);
  pipe(drawChartFill, drawRows, drawFooter, drawChartLine)(params);
}
