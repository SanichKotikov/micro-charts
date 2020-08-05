import type { IParams } from '../types';
import { getColumns, getOptions, hasFooter } from '../core';
import { setupCanvas } from '../draw';
import { setupEvents } from '../events';
import type { ILineChartData, ILineChartOptions, ILineData, IOptions } from './types';
import { OPTIONS } from './config';
import { calcPoints } from './helpers';
import { draw } from './draw';

export function createLineChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Partial<Readonly<ILineChartOptions>> = {},
) {
  const custom = { ...OPTIONS, ...options };
  const values = data.map(item => item.value);
  const opt: Readonly<IOptions> = getOptions(canvas, custom, values, hasFooter(data));

  setupCanvas(canvas, opt.ratio);

  const paths = calcPoints(data, opt);
  const params: IParams<ILineData, IOptions> = {
    canvas,
    drawData: paths,
    options: opt,
    columns: getColumns(data.slice(1)),
  };

  draw(params);

  return setupEvents(params, draw, () => ({
    items: paths.slice(1, paths.length - (opt.hoverType === 'point' ? 1 : 0)),
    fill: () => opt.hoverColor,
  }));
}
