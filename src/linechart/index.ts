import { setupCanvas } from '../core';
import { ILineChartData, ILineChartOptions, IOptions } from './types';
import { OPTIONS } from './constants';
import { calcPoints, draw } from './helpers';
import { events } from './events';

export function createLineChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<ILineChartData>,
  options: Partial<ILineChartOptions> = {},
) {
  const { width, height } = canvas;
  const opt: IOptions = { ...OPTIONS, ...options, width, height };
  setupCanvas(canvas, width, height, opt.ratio);

  const paths = calcPoints(data, opt);
  draw(canvas, paths, opt);

  return events({ canvas, paths, options: opt });
}
