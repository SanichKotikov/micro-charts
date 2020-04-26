import { OPTIONS } from './constants';
import { ILineChartData, IPadding, IEdges, IPoint, ILineChartOptions, IOptions } from './types';

function calcEdges(
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Partial<Readonly<ILineChartOptions>>,
): Readonly<IEdges> {
  const { top, bottom } = options;
  const values = data.map(item => item.value);

  let upper = top ?? Math.max.apply(null, values);
  let lower = bottom ?? Math.min.apply(null, values);
  const shift = (upper - lower) * 5 / 100;

  if (typeof top !== 'number') upper = Math.ceil(upper + shift);
  if (typeof bottom !== 'number') lower = Math.floor(lower - shift)

  return { top: upper, bottom: lower };
}

function calcPadding(
  canvas: HTMLCanvasElement,
  options: Readonly<ILineChartOptions>,
  biggestLabel: string,
): Readonly<IPadding> {
  const { levelStroke, levelFont } = options;
  const stroke = levelStroke / 2;

  if (!levelFont) return { sPadding: 0, vPadding: stroke };

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.font = levelFont;
  const { actualBoundingBoxAscent, width } = ctx.measureText(biggestLabel);

  return {
    sPadding: Math.ceil(width + 2), // font width, plus 2px
    vPadding: Math.max(stroke, actualBoundingBoxAscent / 2),
  };
}

export function getOptions(
  canvas: HTMLCanvasElement,
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Partial<Readonly<ILineChartOptions>> = {},
): Readonly<IOptions> {
  const custom: Readonly<ILineChartOptions> = { ...OPTIONS, ...options };
  const edges = calcEdges(data, options);

  const labels = [edges.top, edges.bottom]
    .map(num => Math.round(num).toString())
    .sort((a, b) => b.length - a.length);

  const padding = calcPadding(canvas, custom, labels[0]);

  const { width, height } = canvas;
  return { ...custom, width, height, ...edges, ...padding };
}

export function calcPoints(
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<IPoint>> {
  const { width, height, top, bottom, sPadding, vPadding, hoverType, onClick, onHoverChange } = options;

  const W = (width - sPadding) / (data.length - 1);
  const H = (height - (vPadding * 2)) / (top - bottom);

  return data.map((item, i) => {
    const x = i * W + sPadding;
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
