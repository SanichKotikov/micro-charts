import type {
  IDrawBarData,
  IDrawBarOptions,
  IDrawData,
  IDrawLevelOptions,
  IDrawLineOptions,
  IParams,
  IPoint,
} from './types';
import { calcH, getFontStr, getLinePath, getRectPath } from './core';

export function setupCanvas(canvas: HTMLCanvasElement, ratio: number) {
  const { width, height } = canvas.getBoundingClientRect();

  canvas.width = width * ratio;
  canvas.height = height * ratio;

  (canvas.getContext('2d') as CanvasRenderingContext2D).scale(ratio, ratio);
}

export function clearCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  (canvas.getContext('2d') as CanvasRenderingContext2D).clearRect(0, 0, width, height);
}

export function drawLabel(
  ctx: CanvasRenderingContext2D,
  skeleton: boolean | undefined,
  value: number,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  if (skeleton) ctx.fill(getRectPath(0, y - h, w, h, 2));
  else ctx.fillText(Math.round(value).toString(), x, y);
}

export function setRowStyle<O extends IDrawLevelOptions>(params: IParams<any, O>, isFooter = false) {
  const { canvas, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { rowStroke, rowColor, rowFont, rowFontColor, rowFontSize, rowFontAlign, footerColor } = options;

  ctx.lineWidth = rowStroke;
  ctx.strokeStyle = isFooter && typeof footerColor === 'string' ? footerColor : rowColor;

  const labelColor = typeof rowFontColor === 'string' ? rowFontColor : rowColor;

  if (typeof rowFont === 'string') {
    ctx.font = getFontStr(rowFont, rowFontSize);
    ctx.textAlign = rowFontAlign;
    ctx.fillStyle = labelColor;
  }
}

export function drawRows<O extends IDrawLevelOptions>(params: IParams<any, O>) {
  const { canvas, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const { rowStroke, rowCount } = options;
  if (!Number.isFinite(rowCount) || rowCount <= 0 || rowStroke <= 0) return params;

  const { width, height, top, bottom, sPadding, vPadding, footer, rowFont, rowFontSize } = options;
  const count = Math.ceil(rowCount);
  const head = rowFont ? rowFontSize : 0;
  const H = calcH(height, vPadding, head, footer) / count;

  const step = (top - bottom) / count;
  const { rowMargin, rowSkeleton, rowFontAlign } = options;

  const left = sPadding + rowMargin;
  const x = rowFontAlign === 'right' ? sPadding : 0;

  setRowStyle(params);

  for (let i = 0; i < count; i++) {
    const y = (i * H) + vPadding + head;
    ctx.stroke(getLinePath(left, y, width, y));

    if (rowFont) {
      const label = top - (step * i);
      drawLabel(ctx, rowSkeleton, label, x, y, sPadding, rowFontSize);
    }
  }

  return params;
}

function getBackground(ctx: CanvasRenderingContext2D, fill: string | ReadonlyArray<string>, height: number) {
  if (Array.isArray(fill) && fill.length == 1) return fill[0] as string;
  if (Array.isArray(fill) && fill.length > 1) {
    const step = 1 / (fill.length - 1);
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    fill.forEach((item, i) => {
      gradient.addColorStop(i * step, item);
    });
    return gradient;
  }
  return fill as string;
}

function drawCurvePath<P extends IPoint>(
  ctx: CanvasRenderingContext2D,
  points: ReadonlyArray<Readonly<P>>,
  smooth = false,
) {
  if (!smooth) {
    points.forEach(({ x, y }) => ctx.lineTo(x, y));
    return;
  }

  ctx.lineTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];

    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;

    ctx.quadraticCurveTo((midX + curr.x) / 2, curr.y, midX, midY);
    ctx.quadraticCurveTo((midX + next.x) / 2, next.y, next.x, next.y);
  }
}

export function drawChartFill<P extends IDrawData & IPoint, O extends IDrawLineOptions>(params: IParams<P, O>) {
  const { canvas, drawData, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { height, width, sPadding, lineFill, rowMargin, footer } = options;

  ctx.beginPath();
  ctx.lineTo(sPadding + rowMargin, height - footer);
  drawCurvePath(ctx, drawData, options.lineSmooth);
  ctx.lineTo(width, height - footer);
  ctx.closePath();
  ctx.fillStyle = getBackground(ctx, lineFill, height);
  ctx.fill();

  return params;
}

export function drawChartLine<P extends IDrawData & IPoint, O extends IDrawLineOptions>(params: IParams<P, O>) {
  const { canvas, drawData, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (options.lineStroke > 0) {
    ctx.beginPath();
    drawCurvePath(ctx, drawData, options.lineSmooth);
    ctx.lineWidth = options.lineStroke;
    ctx.strokeStyle = options.lineColor;
    ctx.stroke();
  }

  if (options.pointRadius > 0) {
    ctx.fillStyle = options.lineColor;
    drawData.forEach(({ x, y }, i, self) => {
      if (i !== 0 && i !== self.length - 1) {
        ctx.beginPath();
        ctx.arc(x, y, options.pointRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  return params;
}

export function drawBars<P extends IDrawBarData, O extends IDrawBarOptions>(skipLeft = 0) {
  return (params: IParams<P, O>) => {
    const { canvas, options: { barColors } } = params;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    params.drawData.slice(skipLeft).forEach((item) => {
      item.bars.forEach((path, i) => {
        ctx.fillStyle = barColors[Math.min(i, barColors.length - 1)];
        ctx.fill(path);
      });
    });

    return params;
  };
}

export function drawFooter<O extends IDrawLevelOptions>(params: IParams<any, O>) {
  const { canvas, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const { rowStroke, rowCount } = options;
  if (!Number.isFinite(rowCount) || rowCount <= 0 || rowStroke <= 0) return params;

  const { width, height, sPadding, footer, bottom, footerMargin } = options;
  const { rowMargin, rowFont, rowFontAlign, rowFontSize, rowSkeleton } = options;

  const left = sPadding + rowMargin;
  const x = rowFontAlign === 'right' ? sPadding : 0;
  const y = height - footer;
  const stroke = rowStroke / 2;

  setRowStyle(params, true);

  ctx.stroke(getLinePath(left, y, width, y));
  if (rowFont) drawLabel(ctx, rowSkeleton, bottom, x, y, sPadding, rowFontSize);

  const { columns } = params;

  if (typeof rowFont === 'string' && columns) {
    const colW = (width - left) / (columns.length);
    const fontTop = y + footerMargin;
    const fY = fontTop + rowFontSize;
    ctx.textAlign = 'center';

    columns.forEach((column, i) => {
      const colX = i * colW + left + stroke;
      ctx.stroke(getLinePath(colX, y + stroke, colX, y + (footerMargin / 2)));
      const cX = colX + (colW / 2);

      if (rowSkeleton) {
        const sW = colW / 3;
        ctx.fill(getRectPath(cX - (sW / 2), fontTop, sW, rowFontSize, 2));
      }
      else ctx.fillText(column, cX, fY);
    });

    const lX = width - stroke;
    ctx.stroke(getLinePath(lX, y - stroke, lX, y + 4));
  }

  return params;
}
