import { IParams } from '../types';
import { setupCanvas, getColumns, setupEvents } from '../core';
import { ILineChartData, IPoint, ILineChartOptions, IOptions } from './types';
import { getOptions, calcPoints } from './helpers';
import { draw } from './draw';

export function createLineChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Partial<Readonly<ILineChartOptions>> = {},
) {
  const opt = getOptions(canvas, data, options);
  setupCanvas(canvas, opt.width, opt.height, opt.ratio);

  const paths = calcPoints(data, opt);
  const params: IParams<IPoint, IOptions> = { canvas, paths, options: opt, columns: getColumns(data) };

  draw(params);

  return setupEvents(params, draw, () => ({
    items: paths.slice(1, paths.length - (opt.hoverType === 'point' ? 1 : 0)),
    fill: () => opt.hoverColor,
  }));
}
