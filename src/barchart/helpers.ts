import { calcH, getBarPath } from '../core';
import { IBarChartData, IBarData, IOptions } from './types';

export function calcData(
  data: ReadonlyArray<Readonly<IBarChartData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<IBarData>> {
  const { width, height, sPadding, vPadding, top, bottom, rowMargin, rowFont, rowFontSize, footer } = options;

  const head = rowFont ? rowFontSize : 0;
  const lShift = sPadding + rowMargin;

  const W = (width - lShift) / (data.length);
  const H = calcH(height, vPadding, head, footer) / (top - bottom);

  const { barWidth, barMargin, barRadius } = options;
  const ptW = barWidth + (barMargin * 2);

  return data.map((item, i) => {
    const x = i * W + lShift;

    const shift = (W - (ptW * item.values.length)) / 2;

    const bars = item.values.map((value, idx) => {
      if (value <= bottom) return new Path2D();

      const pX = x + shift + (idx * ptW) + barMargin;
      const pY = (top - value) * H + vPadding + head;
      return getBarPath(pX, pY, barWidth, height - footer, barRadius);
    });

    const mask = new Path2D();
    mask.rect(x, 0, W, height - footer);

    return { data: item, bars, mask };
  });
}
