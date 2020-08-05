import { calcFactors, getBarFunc } from '../core';
import type { IData, ILineBarData, IOptions } from './types';

export function calcData(
  data: ReadonlyArray<Readonly<ILineBarData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<IData>> {
  const { W, H, head, footer, calcX, calcY } = calcFactors(options, data.length - 1);
  const calcBars = getBarFunc(options, W, H, head);

  return data.map((item, i) => {
    const x = calcX(i);
    const y = calcY(item.value);

    const bars = calcBars(item.bars, x - W);

    const mask = new Path2D();
    mask.rect(x - W, 0, W, footer);

    return { data: item, x, y, bars, mask };
  });
}
