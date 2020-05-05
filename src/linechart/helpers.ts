import { calcFactors } from '../core';
import { ILineChartData, ILineData, IOptions } from './types';

export function calcPoints(
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<ILineData>> {
  const { hoverType } = options;
  const { W, footer, calcX, calcY } = calcFactors(options, data.length - 1);

  return data.map((item, i) => {
    const x = calcX(i);
    const y = calcY(item.value);

    const mask = new Path2D();
    hoverType === 'segment'
      ? mask.rect((x - W), 0, W, footer)
      : mask.arc(x, y, options.pointRadius * 6, 0, Math.PI * 2);

    return { data: item, x, y, mask };
  });
}
