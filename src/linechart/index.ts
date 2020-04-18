import { IParams } from '../types';
import { setupCanvas, setupEvents } from '../core';
import { ILineChartData, IPoint, ILineChartOptions, IOptions } from './types';
import { OPTIONS } from './constants';
import { calcPoints, draw } from './helpers';

export function createLineChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Partial<Readonly<ILineChartOptions>> = {},
) {
  const { width, height } = canvas;
  const opt: Readonly<IOptions> = { ...OPTIONS, ...options, width, height };
  setupCanvas(canvas, width, height, opt.ratio);

  const paths = calcPoints(data, opt);
  const params: IParams<IPoint, IOptions> = { canvas, paths, options: opt };

  draw(params);

  return setupEvents(params, draw, () => ({
    items: paths.slice(1, paths.length - (opt.hoverType === 'point' ? 1 : 0)),
    fill: () => opt.hoverColor,
  }));
}
