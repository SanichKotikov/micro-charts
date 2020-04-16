import { getCanvasPoint, handleEvents } from '../core';
import { IArguments } from '../types';
import { IPieChartData, IPieChartSlice, IPieChartOptions } from './types';
import { HOVER_ALPHA } from './constants';
import { draw } from './helpers';

function clickHandler(args: IArguments<IPieChartSlice, IPieChartOptions>) {
  const canvas = args.canvas;
  const { ratio, onClick } = args.options;

  return (event: MouseEvent) => {
    if (!onClick) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const [cX, cY] = getCanvasPoint(canvas, ratio, event);

    for (let i = 0; i < args.paths.length; i++) {
      const { path, data } = args.paths[i];

      if (ctx.isPointInPath(path, cX, cY)) {
        onClick(data);
        return;
      }
    }
  };
}

function moveHandler(args: IArguments<IPieChartSlice, IPieChartOptions>) {
  const canvas = args.canvas;
  const { ratio, onClick, onHoverChange } = args.options;

  return (event: MouseEvent) => {
    if (!onHoverChange) return;

    let cursor: string = 'default';
    let found: IPieChartData | undefined = undefined;
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

function leaveHandler(args: IArguments<IPieChartSlice, IPieChartOptions>) {
  const canvas = args.canvas;
  const { onClick, onHoverChange } = args.options;

  return () => {
    draw(canvas, args.paths, args.options);
    if (onHoverChange) onHoverChange(undefined);
    if (onClick) canvas.style.cursor = 'default';
  }
}

export function events(args: IArguments<IPieChartSlice, IPieChartOptions>) {
  return handleEvents(args, { clickHandler, moveHandler, leaveHandler });
}
