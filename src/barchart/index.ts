import type { IParams } from '../types';
import { getColumns, getOptions, hasFooter } from '../core';
import { setupCanvas } from '../draw';
import { setupEvents } from '../events';
import type { IBarChartData, IBarChartOptions, IBarData, IOptions } from './types';
import { OPTIONS } from './config';
import { calcData } from './helpers';
import { draw } from './draw';

export function createBarChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<IBarChartData>>,
  options: Partial<Readonly<IBarChartOptions>> = {},
) {
  const custom = { ...OPTIONS, ...options };
  const values = data
    .map(item => item.values as number[])
    .reduce((res, current) => [...res, ...current], []);
  const opt: Readonly<IOptions> = getOptions(canvas, custom, values, hasFooter(data));

  setupCanvas(canvas, opt.ratio);

  const paths = calcData(data, opt);
  const params: IParams<IBarData, IOptions> = {
    canvas,
    drawData: paths,
    options: opt,
    columns: getColumns(data),
  };

  draw(params);

  return setupEvents(params, draw, () => ({
    items: paths,
    fill: () => opt.hoverColor,
  }));
}
