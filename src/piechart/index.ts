import { IParams } from '../types';
import { setupCanvas } from '../draw';
import { setupEvents } from '../events';
import { IPieChartData, IPieChartSlice, IPieChartOptions } from './types';
import { OPTIONS } from './constants';
import { adjustColor, calc, draw } from './helpers';

export function createPieChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<IPieChartData>>,
  options: Partial<Readonly<IPieChartOptions>> = {},
) {
  const opt: Readonly<IPieChartOptions> = { ...OPTIONS, ...options };
  setupCanvas(canvas, opt.size, opt.size, opt.ratio);

  const paths = calc(data, opt);
  const params: IParams<IPieChartSlice, IPieChartOptions> = { canvas, paths, options: opt };

  draw(params);

  return setupEvents(params, draw, () => ({
    items: paths,
    fill: (color = '#000000') => adjustColor(color, 10),
  }));
}
