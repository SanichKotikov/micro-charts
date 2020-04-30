import { IParams } from '../types';
import { setupCanvas, getColumns, setupEvents } from '../core';
import { IBarChartData, IBarData, IBarChartOptions, IOptions } from './types';
import { getOptions, calcData } from './helpers';
import { draw } from './draw';

export function createBarChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<IBarChartData>>,
  options: Partial<Readonly<IBarChartOptions>> = {},
) {
  const opt = getOptions(canvas, data, options);
  setupCanvas(canvas, opt.width, opt.height, opt.ratio);

  const paths = calcData(data, opt);
  const params: IParams<IBarData, IOptions> = { canvas, paths, options: opt, columns: getColumns(data) };

  draw(params);

  return setupEvents(params, draw, () => ({
    items: paths,
    fill: () => opt.hoverColor,
  }));
}
