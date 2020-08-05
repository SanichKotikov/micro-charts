import type { IParams } from '../types';
import { getColumns, getOptions, hasFooter } from '../core';
import { setupCanvas } from '../draw';
import { setupEvents } from '../events';
import type { IData, ILineBarData, ILineBarOptions, IOptions } from './types';
import { OPTIONS } from './config';
import { calcData } from './helpers';
import { draw } from './draw';

export function createLineBarChart(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<ILineBarData>>,
  options: Partial<Readonly<ILineBarOptions>> = {},
) {
  const custom: Readonly<ILineBarOptions> = { ...OPTIONS, ...options };
  const values = data
    .map(item => [item.value, ...item.bars])
    .reduce((res, current) => [...res, ...current], []);
  const opt = getOptions(canvas, custom, values, hasFooter(data));

  setupCanvas(canvas, opt.ratio);

  const paths = calcData(data, opt);
  const params: IParams<IData, IOptions> = {
    canvas,
    drawData: paths,
    options: opt,
    columns: getColumns(data.slice(1)),
  };

  draw(params);

  return setupEvents(params, draw, () => ({
    items: paths.slice(1),
    fill: () => opt.hoverColor,
  }));
}
