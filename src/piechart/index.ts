import { IParams } from '../types';
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

  canvas.width = opt.size * opt.ratio;
  canvas.height = opt.size * opt.ratio;
  (canvas.getContext('2d') as CanvasRenderingContext2D).scale(opt.ratio, opt.ratio);

  const paths = calc(data, opt);
  const params: IParams<IPieChartSlice, IPieChartOptions> = { canvas, drawData: paths, options: opt };

  draw(params);

  return setupEvents(params, draw, () => ({
    items: paths,
    fill: (color = '#000000') => adjustColor(color, 10),
  }));
}
