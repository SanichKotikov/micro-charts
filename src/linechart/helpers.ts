import { calcH } from '../core';
import { ILineChartData, ILineData, IOptions } from './types';

export function calcPoints(
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<ILineData>> {
  const { width, height, top, bottom, sPadding, vPadding, rowMargin, rowFont, rowFontSize, footer } = options;

  const head = rowFont ? rowFontSize : 0;
  const lShift = sPadding + rowMargin;

  const W = (width - lShift) / (data.length - 1);
  const H = calcH(height, vPadding, head, footer) / (top - bottom);

  const { hoverType } = options;

  return data.map((item, i) => {
    const x = i * W + lShift;
    const y = (top - item.value) * H + vPadding + head;

    const mask = new Path2D();

    hoverType === 'segment'
      ? mask.rect((x - W), 0, W, height - footer)
      : mask.arc(x, y, options.pointRadius * 6, 0, Math.PI * 2);

    return { data: item, x, y, mask };
  });
}
