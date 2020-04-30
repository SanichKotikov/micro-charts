import { hasFooter, calcH, calcEdges, calcPadding } from '../core';
import { IBarChartData, IBarData, IBarChartOptions, IOptions } from './types';
import { OPTIONS } from './constants';

export function getOptions(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<IBarChartData>>,
  options: Partial<Readonly<IBarChartOptions>> = {},
): Readonly<IOptions> {
  const custom: Readonly<IBarChartOptions> = { ...OPTIONS, ...options };

  const values = data
    .map(item => item.values as number[])
    .reduce((res, current) => [...res, ...current], []);

  const edges = calcEdges(values, custom.top, custom.bottom);
  const { rowStroke, rowFont, rowFontSize, footerMargin } = custom;
  const padding = calcPadding(canvas, edges, rowStroke, rowFontSize, rowFont);
  const footer = hasFooter(data) ? rowFontSize + footerMargin : 0;

  const { width, height } = canvas;
  return { ...custom, width, height, ...edges, ...padding, footer };
}

function getBarPath(x: number, y: number, w: number, b: number, r: number) {
  const path = new Path2D();
  const h = b - y;

  if (r <= 0) {
    path.rect(x, y, w, h);
    return path;
  }

  const radius = Math.min(r, (w / 2), h);
  const yR = y + radius;
  const x2 = x + w;

  path.moveTo(x, b);
  path.lineTo(x, yR);
  path.quadraticCurveTo(x, y, x + radius, y);
  path.lineTo(x2 - radius, y);
  path.quadraticCurveTo(x2, y, x2, yR);
  path.lineTo(x2, b);
  path.closePath();

  return path;
}

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

    const pillars = item.values.map((value, idx) => {
      if (value <= bottom) return new Path2D();

      const pX = x + shift + (idx * ptW) + barMargin;
      const pY = (top - value) * H + vPadding + head;
      return getBarPath(pX, pY, barWidth, height - footer, barRadius);
    });

    const mask = new Path2D();
    mask.rect(x, 0, W, height - footer);

    return { data: item, pillars, path: mask };
  });
}
