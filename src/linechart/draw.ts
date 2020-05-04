import { IParams } from '../types';
import { pipe } from '../core';
import { clearCanvas, drawRows, drawChartFill, drawChartLine, drawFooter } from '../draw';
import { ILineData, IOptions } from './types';

export function draw(params: IParams<ILineData, IOptions>) {
  const { canvas, options: { width, height } } = params;
  clearCanvas(canvas, width, height);
  pipe(drawRows, drawChartFill, drawFooter, drawChartLine)(params);
}
