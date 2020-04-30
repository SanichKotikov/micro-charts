import { hasFooter, calcH, calcEdges, calcPadding } from '../core';
import { OPTIONS } from './constants';
import { ILineChartData, IPoint, ILineChartOptions, IOptions } from './types';

export function getOptions(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Partial<Readonly<ILineChartOptions>> = {},
): Readonly<IOptions> {
  const custom: Readonly<ILineChartOptions> = { ...OPTIONS, ...options };
  const edges = calcEdges(data.map(item => item.value), options.top, options.bottom);
  const { rowStroke, rowFont, rowFontSize, footerMargin } = custom;
  const padding = calcPadding(canvas, edges, rowStroke, rowFontSize, rowFont);
  const footer = hasFooter(data) ? rowFontSize + footerMargin : 0;

  const { width, height } = canvas;
  return { ...custom, width, height, ...edges, ...padding, footer };
}

export function calcPoints(
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<IPoint>> {
  const { width, height, top, bottom, sPadding, vPadding, rowMargin, rowFont, rowFontSize, footer } = options;

  const head = rowFont ? rowFontSize : 0;
  const lShift = sPadding + rowMargin;

  const W = (width - lShift) / (data.length - 1);
  const H = calcH(height, vPadding, head, footer) / (top - bottom);

  const { hoverType, onClick, onHoverChange } = options;

  return data.map((item, i) => {
    const x = i * W + lShift;
    const y = (top - item.value) * H + vPadding + head;
    const path = new Path2D();

    if (onClick || onHoverChange) {
      hoverType === 'segment'
        ? path.rect((x - W), 0, W, height - footer)
        : path.arc(x, y, options.pointRadius * 6, 0, Math.PI * 2);
    }

    return { data: item, x, y, path };
  });
}
