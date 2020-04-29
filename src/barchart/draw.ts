import { IParams } from '../types';
import { clearCanvas, drawRows } from '../core';
import { IBarData, IOptions } from './types';

export function draw(params: IParams<IBarData, IOptions>) {
  const { canvas, options: { width, height } } = params;

  clearCanvas(canvas, width, height);
  drawRows(params);

  const { fill } = params.options;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  params.paths.forEach((item) => {
    item.pillars.forEach((path, i) => {
      ctx.fillStyle = fill[Math.min(i, fill.length - 1)];
      ctx.fill(path);
    })
  });
}