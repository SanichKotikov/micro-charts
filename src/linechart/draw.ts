import { IParams } from '../types';
import { pipe, clearCanvas, drawRows, drawFooter } from '../core';
import { IPoint, IOptions } from './types';

function fill(params: IParams<IPoint, IOptions>) {
  const { canvas, paths, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const { height, width, sPadding, fill, rowMargin, footer } = options;
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
  ctx.lineTo(sPadding + rowMargin, height - footer);
  paths.forEach(({ x, y }) => ctx.lineTo(x, y));
  ctx.lineTo(width, height - footer);
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

export function draw(params: IParams<IPoint, IOptions>) {
  const { canvas, options: { width, height } } = params;
  clearCanvas(canvas, width, height);
  pipe(drawRows, fill, drawFooter, line)(params);
}
