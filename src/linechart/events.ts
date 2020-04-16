import { getCanvasPoint, handleEvents } from '../core';
import { IArguments } from '../types';
import { ILineChartData, IPoint, IOptions } from './types';
import { draw } from './helpers';

function moveHandler(args: IArguments<IPoint, IOptions>) {
  const canvas = args.canvas;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { ratio, hoverColor, onHoverChange } = args.options;

  return (event: MouseEvent) => {
    if (!onHoverChange) return;
    const [cX, cY] = getCanvasPoint(canvas, ratio, event);
    draw(canvas, args.paths, args.options);

    let found: ILineChartData | undefined;
    const length = args.paths.length - (args.options.hoverType === 'point' ? 1 : 0);

    for (let i = 1; i < length; i++) {
      const { data, segment } = args.paths[i];

      if (ctx.isPointInPath(segment, cX, cY)) {
        ctx.fillStyle = hoverColor;
        ctx.fill(segment);
        found = data;
        break;
      }
    }

    const { clientX, clientY } = event;
    onHoverChange(found && { data: found, clientX, clientY });
  };
}

function leaveHandler(args: IArguments<IPoint, IOptions>) {
  const canvas = args.canvas;
  const { onHoverChange } = args.options;

  return () => {
    draw(canvas, args.paths, args.options);
    if (onHoverChange) onHoverChange(undefined);
  };
}

export function events(args: IArguments<IPoint, IOptions>) {
  return handleEvents(args, { moveHandler, leaveHandler });
}
