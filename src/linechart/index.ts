import { ILineChartData, ILineChartOptions } from './types';
import { OPTIONS } from './constants';
import { setup, calcPoints, draw } from './helpers';
import { handleEvents } from './events';

export function createLineChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<ILineChartData>,
  options: Partial<ILineChartOptions> = {},
) {
  const { ctx, opt } = setup(canvas, { ...OPTIONS, ...options });
  const points = calcPoints(data, opt);
  draw(ctx, points, opt);

  return handleEvents({ canvas, points, options: opt });
}
