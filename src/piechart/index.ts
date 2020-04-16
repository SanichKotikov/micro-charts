import { setupCanvas } from '../core';
import { IPieChartData, IPieChartOptions } from './types';
import { OPTIONS } from './constants';
import { calc, draw } from './helpers';
import { events } from './events';

export function createPieChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<IPieChartData>,
  options: Partial<IPieChartOptions> = {},
) {
  const opt: IPieChartOptions = { ...OPTIONS, ...options };
  setupCanvas(canvas, opt.size, opt.size, opt.ratio);

  const paths = calc(data, opt);
  draw(canvas, paths, opt);

  return events({ canvas, paths, options: opt });
}
