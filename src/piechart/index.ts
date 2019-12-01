import { IPieChartData, IPieChartOptions } from './types';
import { OPTIONS } from './constants';
import { setup, calc, draw } from './helpers';
import { handleEvents } from './events';

export function createPieChart(
  canvas: HTMLCanvasElement,
  data: IPieChartData[],
  options: Partial<IPieChartOptions> = {},
) {
  const opt = { ...OPTIONS, ...options };
  setup(canvas, opt);

  const slices = calc(data, opt);
  draw(canvas, slices);

  return handleEvents(canvas, slices, opt);
}
