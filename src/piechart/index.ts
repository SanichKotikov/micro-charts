import { IPieChartData, IPieChartOptions } from './types';
import { OPTIONS } from './constants';
import { setup, calc, draw } from './helpers';
import { handleEvents } from './events';

export function createPieChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<IPieChartData>,
  options: Partial<IPieChartOptions> = {},
) {
  const opt: IPieChartOptions = { ...OPTIONS, ...options };
  setup(canvas, opt);

  const slices = calc(data, opt);
  draw(canvas, slices, opt);

  return handleEvents(canvas, slices, opt);
}
