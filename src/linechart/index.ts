import { ILineChartData, ILineChartOptions } from './types';
import { OPTIONS } from './constants';
import { setup, draw } from './helpers';

export function createLineChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<ILineChartData>,
  options: Partial<ILineChartOptions> = {},
) {
  const opt = setup(canvas, { ...OPTIONS, ...options });
  draw(canvas, data, opt);
}
