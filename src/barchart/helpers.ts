import { calcFactors, getBarFunc } from '../core';
import type { IBarChartData, IBarData, IOptions } from './types';

export function calcData(
  data: ReadonlyArray<Readonly<IBarChartData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<IBarData>> {
  const { W, H, footer, calcX } = calcFactors(options, data.length);
  const calcBars = getBarFunc(options, W, H);

  return data.map((item, i) => {
    const x = calcX(i);
    const bars = calcBars(item.values, x);

    const mask = new Path2D();
    mask.rect(x, 0, W, footer);

    return { data: item, bars, mask };
  });
}
