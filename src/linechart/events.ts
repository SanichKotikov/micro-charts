import { getCanvasPoint, handleEvents } from '../core';
import { IArguments } from '../types';
import { ILineChartData, IPoint, IOptions } from './types';
import { draw } from './helpers';

function moveHandler(args: Readonly<IArguments<IPoint, IOptions>>) {
  const canvas = args.canvas;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { ratio, hoverColor, onClick, onHoverChange } = args.options;

  return (event: MouseEvent) => {
    if (!onHoverChange) return;
    const [cX, cY] = getCanvasPoint(canvas, ratio, event);
    draw(canvas, args.paths, args.options);

    let cursor: string = 'default';
    let found: Readonly<ILineChartData> | undefined;
    const length = args.paths.length - (args.options.hoverType === 'point' ? 1 : 0);

    for (let i = 1; i < length; i++) {
      const { data, path } = args.paths[i];

      if (ctx.isPointInPath(path, cX, cY)) {
        ctx.fillStyle = hoverColor;
        ctx.fill(path);
        cursor = 'pointer';
        found = data;
        break;
      }
    }

    const { clientX, clientY } = event;
    onHoverChange(found && { data: found, clientX, clientY });
    if (onClick) canvas.style.cursor = cursor;
  };
}

export function events(args: Readonly<IArguments<IPoint, IOptions>>) {
  return handleEvents(args, draw, { moveHandler });
}
