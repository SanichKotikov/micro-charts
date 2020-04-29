import { calcEdges, calcPadding } from '../core';
import { OPTIONS } from './constants';
import { ILineChartData, IPoint, ILineChartOptions, IOptions } from './types';

export function getOptions(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Partial<Readonly<ILineChartOptions>> = {},
): Readonly<IOptions> {
  const custom: Readonly<ILineChartOptions> = { ...OPTIONS, ...options };
  const edges = calcEdges(data.map(item => item.value), options.top, options.bottom);
  const padding = calcPadding(canvas, edges, custom.rowStroke, custom.rowFont);

  const { width, height } = canvas;
  return { ...custom, width, height, ...edges, ...padding };
}

export function calcPoints(
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<IPoint>> {
  const { width, height, top, bottom, sPadding, vPadding, rowMargin, hoverType, onClick, onHoverChange } = options;

  const startX = sPadding + rowMargin;
  const W = (width - startX) / (data.length - 1);
  const H = (height - (vPadding * 2)) / (top - bottom);

  return data.map((item, i) => {
    const x = i * W + startX;
    const y = (top - item.value) * H + vPadding;
    const path = new Path2D();

    if (onClick || onHoverChange) {
      hoverType === 'segment'
        ? path.rect((x - W), 0, W, height)
        : path.arc(x, y, options.pointRadius * 6, 0, Math.PI * 2);
    }

    return { data: item, x, y, path };
  });
}
