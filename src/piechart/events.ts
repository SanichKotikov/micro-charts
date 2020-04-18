import { getCanvasPoint, handleEvents } from '../core';
import { IArguments } from '../types';
import { IPieChartData, IPieChartSlice, IPieChartOptions } from './types';
import { HOVER_ALPHA } from './constants';
import { draw } from './helpers';

function moveHandler(args: Readonly<IArguments<IPieChartSlice, IPieChartOptions>>) {
  const canvas = args.canvas;
  const { ratio, onClick, onHoverChange } = args.options;

  return (event: MouseEvent) => {
    if (!onHoverChange) return;

    let cursor: string = 'default';
    let found: Readonly<IPieChartData> | undefined = undefined;
    const [cX, cY] = getCanvasPoint(canvas, ratio, event);

    draw(canvas, args.paths, args.options, (ctx, path, data) => {
      if (found === undefined && ctx.isPointInPath(path, cX, cY)) {
        ctx.globalAlpha = HOVER_ALPHA;
        cursor = 'pointer';
        found = data;
        return;
      }
      ctx.globalAlpha = 1;
    });

    const { clientX, clientY } = event;
    onHoverChange(found && { data: found, clientX, clientY });
    if (onClick) canvas.style.cursor = cursor;
  };
}

export function events(args: Readonly<IArguments<IPieChartSlice, IPieChartOptions>>) {
  return handleEvents(args, draw, { moveHandler });
}
