import { calcH, getBarPath } from '../core';
import { ILineBarData, IData, IOptions } from './types';

export function calcData(
  data: ReadonlyArray<Readonly<ILineBarData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<IData>> {
  const { width, height, top, bottom, sPadding, vPadding, rowMargin, rowFont, rowFontSize, footer } = options;

  const head = rowFont ? rowFontSize : 0;
  const lShift = sPadding + rowMargin;

  const W = (width - lShift) / (data.length - 1);
  const H = calcH(height, vPadding, head, footer) / (top - bottom);

  const { barWidth, barMargin, barRadius } = options;
  const ptW = barWidth + (barMargin * 2);

  return data.map((item, i) => {
    const x = i * W + lShift;
    const y = (top - item.value) * H + vPadding + head;

    const shift = (W - (ptW * item.bars.length)) / 2;

    const bars = item.bars.map((value, idx) => {
      if (value <= bottom) return new Path2D();

      const pX = x - W + shift + (idx * ptW) + barMargin;
      const pY = (top - value) * H + vPadding + head;
      return getBarPath(pX, pY, barWidth, height - footer, barRadius);
    });

    const mask = new Path2D();
    mask.rect(x - W, 0, W, height - footer);

    return { data: item, x, y, bars, mask };
  });
}
