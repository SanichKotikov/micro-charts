import { ILineChartData, ILineChartOptions } from './types';
import { OPTIONS } from './constants';
import { setup, calcPoints, drawFill, drawLine, drawRows } from './helpers';

export function createLineChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<ILineChartData>,
  options: Partial<ILineChartOptions> = {},
) {
  const { ctx, opt } = setup(canvas, { ...OPTIONS, ...options });
  const points = calcPoints(data, opt);

  drawFill(ctx, points, opt);
  drawLine(ctx, points, opt);

  drawRows(ctx, opt);
}
