import { pipe, clearCanvas } from '../core';
import { IParams } from '../types';
import { IPoint, IOptions } from './types';

function fill(params: IParams<IPoint, IOptions>) {
  const { canvas, paths, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const { height, width, sPadding, fill } = options;
  let background: string | CanvasGradient = 'transparent';

  if (Array.isArray(fill)) {
    if (fill.length == 1) background = fill[0];
    else if (fill.length > 1) {
      const step = 1 / (fill.length - 1);
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      fill.forEach((item, i) => {
        gradient.addColorStop(i * step, item);
      });
      background = gradient;
    }
  } else {
    background = fill as string;
  }

  ctx.beginPath();
  ctx.lineTo(sPadding, height);
  paths.forEach(({ x, y }) => ctx.lineTo(x, y));
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = background;
  ctx.fill();

  return params;
}

function line(params: IParams<IPoint, IOptions>) {
  const { canvas, paths, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (options.stroke > 0) {
    ctx.beginPath();
    paths.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.lineWidth = options.stroke;
    ctx.strokeStyle = options.color;
    ctx.stroke();
  }

  if (options.pointRadius > 0) {
    ctx.fillStyle = options.color;
    paths.forEach(({ x, y }, i, self) => {
      if (i !== 0 && i !== self.length - 1) {
        ctx.beginPath();
        ctx.arc(x, y, options.pointRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  return params;
}

function rows(params: IParams<IPoint, IOptions>) {
  const { canvas, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const { levelStroke, levelCount } = options;
  if (!Number.isFinite(levelCount) || levelCount <= 0 || levelStroke <= 0) return params;

  const { width, height, top, bottom, sPadding, vPadding, levelColor, levelFont } = options;
  const count = Math.ceil(levelCount);
  const L = (height - vPadding * 2) / count;

  const step = (top - bottom) / count;

  for (let i = 0; i < count + 1; i++) {
    const y = (i * L) + vPadding;
    ctx.beginPath();
    ctx.moveTo(sPadding, y);
    ctx.lineTo(width, y);
    ctx.lineWidth = levelStroke;
    ctx.strokeStyle = levelColor;
    ctx.stroke();

    if (levelFont) {
      ctx.font = levelFont;
      const label = Math.round(top - (step * i)).toString();
      const { actualBoundingBoxAscent } = ctx.measureText(label);
      ctx.fillStyle = levelColor;
      ctx.fillText(label, 0, y + ((actualBoundingBoxAscent - levelStroke / 2) / 2));
    }
  }

  return params;
}

export function draw(params: IParams<IPoint, IOptions>) {
  const { canvas, options: { width, height } } = params;
  clearCanvas(canvas, width, height);
  pipe(fill, line, rows)(params);
}
