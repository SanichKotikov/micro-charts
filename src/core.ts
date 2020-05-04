import { IPadding, IEdges } from './types';

export function pipe(...fus: Function[]) {
  return <T>(init: T) => fus.reduce((res, fn) => fn(res), init);
}

export function getFontStr(name: string, size: number) {
  return `${size}px/1 ${name}`;
}

export function hasFooter<T extends { label?: string }>(items: ReadonlyArray<T>) {
  return items.some(item => typeof item.label === 'string');
}

export function calcH(height: number, padding: number, head: number, footer: number) {
  return height - (padding * 2) - head - footer;
}

export function calcEdges(values: number[], top?: number, bottom?: number): Readonly<IEdges> {
  let upper = top ?? Math.max.apply(null, values);
  let lower = bottom ?? Math.min.apply(null, values);
  const shift = (upper - lower) * 5 / 100;

  if (typeof top !== 'number') upper = Math.ceil(upper + shift);
  if (typeof bottom !== 'number') lower = Math.floor(lower - shift)

  return { top: upper, bottom: lower };
}

export function calcPadding(
  canvas: HTMLCanvasElement,
  edges: IEdges,
  rowStroke: number,
  rowFontSize: number,
  rowFont?: string,
): Readonly<IPadding> {
  const stroke = rowStroke / 2;
  if (!rowFont) return { sPadding: 0, vPadding: stroke };

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.font = getFontStr(rowFont, rowFontSize);

  const labels = [edges.top, edges.bottom]
    .map(num => Math.round(num).toString())
    .sort((a, b) => b.length - a.length);

  const { width } = ctx.measureText(labels[0]);

  return {
    sPadding: Math.ceil(width),
    vPadding: Math.max(stroke),
  };
}

export function getOptions(
  canvas: HTMLCanvasElement,
  options: Readonly<any>,
  values: number[],
  hasFooter: boolean,
): Readonly<any> {
  const edges = calcEdges(values, options.top, options.bottom);
  const { rowStroke, rowFont, rowFontSize, footerMargin } = options;
  const padding = calcPadding(canvas, edges, rowStroke, rowFontSize, rowFont);
  const footer = hasFooter ? rowFontSize + footerMargin : 0;
  const { width, height } = canvas;
  return { ...options, width, height, ...edges, ...padding, footer };
}

export function getColumns<T extends { label?: string }>(data: ReadonlyArray<Readonly<T>>) {
  return hasFooter(data) ? data.map(item => (item.label || '') as string) : undefined;
}

export function getLinePath(x1: number, y1: number, x2: number, y2: number) {
  const path = new Path2D();
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  return path;
}

export function getRectPath(x: number, y: number, w: number, h: number, radius = 0) {
  const path = new Path2D();

  if (radius <= 0) {
    path.rect(x, y, w, h);
    return path;
  }

  const r = Math.min(radius, (w / 2), (h / 2));
  const x2 = x + w;
  const y2 = y + h;

  path.moveTo(x2 - r, y);
  path.quadraticCurveTo(x2, y, x2, y + r);
  path.lineTo(x2, y2 - r);
  path.quadraticCurveTo(x2, y2, x2 - r, y2);
  path.lineTo(x + r, y2);
  path.quadraticCurveTo(x, y2, x, y2 - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
  path.closePath();

  return path;
}

export function getBarPath(x: number, y: number, w: number, b: number, r: number) {
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

export function getCanvasPoint(canvas: HTMLCanvasElement, ratio: number, event: MouseEvent) {
  const { clientX, clientY } = event;
  const { left, top } = canvas.getBoundingClientRect();
  return [(clientX - left) * ratio, (clientY - top) * ratio];
}
