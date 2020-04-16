import { setupCanvas } from '../core';
import { IPieChartData, IPieChartOptions } from './types';
import { OPTIONS } from './constants';
import { calc, draw } from './helpers';
import { events } from './events';

export function createPieChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<IPieChartData>>,
  options: Partial<Readonly<IPieChartOptions>> = {},
) {
  const opt: Readonly<IPieChartOptions> = { ...OPTIONS, ...options };
  setupCanvas(canvas, opt.size, opt.size, opt.ratio);

  const paths = calc(data, opt);
  draw(canvas, paths, opt);

  return events({ canvas, paths, options: opt });
}
