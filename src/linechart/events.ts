import { ILineChartData, IPoint, IOptions } from './types';
import { draw } from './helpers';

interface IArguments {
  canvas: HTMLCanvasElement;
  points: ReadonlyArray<IPoint>;
  options: IOptions;
}

function getEventXY(canvas: HTMLCanvasElement, ratio: number, event: MouseEvent) {
  const { clientX, clientY } = event;
  const { left, top } = canvas.getBoundingClientRect();
  return [(clientX - left) * ratio, (clientY - top) * ratio];
}

function onMouseMove(args: IArguments) {
  const canvas = args.canvas;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { ratio, hoverColor, onHoverChange } = args.options;

  return (event: MouseEvent) => {
    if (!onHoverChange) return;
    const [cX, cY] = getEventXY(canvas, ratio, event);
    draw(ctx, args.points, args.options);

    let found: ILineChartData | undefined;
    const length = args.points.length - (args.options.hoverType === 'point' ? 1 : 0);

    for (let i = 1; i < length; i++) {
      const { data, segment } = args.points[i];

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

function onMouseLeave(args: IArguments) {
  const canvas = args.canvas;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { onHoverChange } = args.options;

  return () => {
    draw(ctx, args.points, args.options);
    if (onHoverChange) onHoverChange(undefined);
  };
}

function subscriber(args: IArguments) {
  const { canvas } = args;

  return (event: string, func: Function, callback: Function | undefined) => {
    const handler = callback && func(args);
    if (handler) canvas.addEventListener(event, handler);
    return () => handler && canvas.removeEventListener(event, handler);
  };
}

export function handleEvents(args: IArguments) {
  const sub = subscriber(args);
  const { onHoverChange } = args.options;

  const unsubMove = sub('mousemove', onMouseMove, onHoverChange);
  const unsubLeave = sub('mouseleave', onMouseLeave, onHoverChange);

  return () => {
    unsubMove();
    unsubLeave();
  };
}
