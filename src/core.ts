import type { IBarOptions, IEdges, IGeometry, IPadding, IRowOptions } from './types';

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

export function formatLabel(value: number, formatter?: (value: number) => string): string {
  return typeof formatter === 'function'
    ? formatter(value)
    : String(Math.round(value));
}

export function calcEdges(values: number[], top?: number, bottom?: number): Readonly<IEdges> {
  let upper = top ?? Math.max.apply(null, values);
  let lower = bottom ?? Math.min.apply(null, values);
  const shift = (upper - lower) * 5 / 100;

  if (typeof top !== 'number') upper = Math.ceil(upper + shift);
  if (typeof bottom !== 'number') lower = Math.floor(lower - shift);

  return { top: upper, bottom: lower };
}

export function calcPadding(
  canvas: HTMLCanvasElement,
  edges: IEdges,
  rowStroke: number,
  rowFontSize: number,
  rowFont?: string,
  rowRenderValue?: (value: number) => string,
): Readonly<IPadding> {
  const stroke = rowStroke / 2;
  if (!rowFont) return { sPadding: 0, vPadding: stroke };

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.font = getFontStr(rowFont, rowFontSize);

  const maxLabelWidth = [edges.top, edges.bottom]
    .map(num => ctx.measureText(formatLabel(num, rowRenderValue)).width)
    .reduce((res, curr) => Math.max(res, curr), 0);

  return {
    sPadding: Math.ceil(maxLabelWidth),
    vPadding: Math.max(stroke),
  };
}

export function getFontMargin(size: number) {
  return Math.ceil(size * 20 / 100); // 20% of font size
}

export function getOptions(
  canvas: HTMLCanvasElement,
  options: Readonly<any>,
  values: number[],
  hasFooter: boolean,
): Readonly<any> {
  const edges = calcEdges(values, options.top, options.bottom);
  const { rowStroke, rowFont, rowFontSize, rowRenderValue, footerMargin } = options;
  const padding = calcPadding(canvas, edges, rowStroke, rowFontSize, rowFont, rowRenderValue);
  const footer = hasFooter ? rowFontSize + getFontMargin(rowFontSize) + footerMargin : 0;
  const { width, height } = canvas.getBoundingClientRect();
  return { ...options, width, height, ...edges, ...padding, footer };
}

export function getColumns<T extends { label?: string }>(data: ReadonlyArray<Readonly<T>>) {
  return hasFooter(data) ? data.map(item => (item.label || '') as string) : undefined;
}

export function calcFactors<O extends IRowOptions & IGeometry>(options: O, dataCount: number) {
  const { width, height, top, bottom, rowFont, rowFontSize, rowMargin, sPadding, vPadding, footer } = options;

  const head = rowFont ? rowFontSize : 0;
  const left = sPadding + rowMargin;

  const W = (width - left) / dataCount;
  const H = calcH(height, vPadding, head, footer) / (top - bottom);

  return {
    W, H, head, footer: height - footer,
    calcX: (idx: number) => (idx * W) + left,
    calcY: (value: number) => (top - value) * H + vPadding + head,
  };
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

export function getBarFunc<O extends IBarOptions & IGeometry>(options: O, W: number, H: number, head: number) {
  const { height, top, bottom, vPadding, footer, barWidth, barMargin, barRadius } = options;
  const bW = barWidth + (barMargin * 2);

  return (values: ReadonlyArray<number>, x: number) => {
    const shift = (W - (bW * values.length)) / 2;

    return values.map((value, idx) => {
      if (value <= bottom) return new Path2D();

      const pX = x + shift + (idx * bW) + barMargin;
      const pY = (top - value) * H + vPadding + head;
      return getBarPath(pX, pY, barWidth, height - footer, barRadius);
    });
  };
}

export function getCanvasPoint(canvas: HTMLCanvasElement, ratio: number, event: MouseEvent) {
  const { clientX, clientY } = event;
  const { left, top } = canvas.getBoundingClientRect();
  return [(clientX - left) * ratio, (clientY - top) * ratio];
}
