import { IPathData, IArguments, IEventHandlers, IEventFunctions } from './types';

export function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number, ratio: number) {
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(ratio, ratio);
}

export function getCanvasPoint(canvas: HTMLCanvasElement, ratio: number, event: MouseEvent) {
  const { clientX, clientY } = event;
  const { left, top } = canvas.getBoundingClientRect();
  return [(clientX - left) * ratio, (clientY - top) * ratio];
}

export function subscriber<P extends IPathData, O extends IEventHandlers>(args: Readonly<IArguments<P, O>>) {
  const { canvas } = args;
  return (
    event: string,
    func: ((args: Readonly<IArguments<P, O>>) => void) | undefined,
    callback: Function | undefined,
  ) => {
    const handler = callback && func && func(args);
    if (handler) canvas.addEventListener(event, handler);
    return () => handler && canvas.removeEventListener(event, handler);
  };
}

function clickHandler<P extends IPathData, O extends IEventHandlers>(args: Readonly<IArguments<P, O>>) {
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

function leaveHandler(drawFunc: Function) {
  return <P extends IPathData, O extends IEventHandlers>(args: Readonly<IArguments<P, O>>) => {
    const canvas = args.canvas;
    const { onClick, onHoverChange } = args.options;

    return () => {
      drawFunc(canvas, args.paths, args.options);
      if (onHoverChange) onHoverChange(undefined);
      if (onClick) canvas.style.cursor = 'default';
    }
  }
}

export function handleEvents<P extends IPathData, O extends IEventHandlers>(
  args: Readonly<IArguments<P, O>>,
  drawFunc: Function,
  handlers: IEventFunctions<P, O>,
) {
  const sub = subscriber(args);
  const { onClick, onHoverChange } = args.options;

  const unsubClick = sub('click', clickHandler, onClick);
  const unsubMove = sub('mousemove', handlers.moveHandler, onHoverChange);
  const unsubLeave = sub('mouseleave', leaveHandler(drawFunc), onHoverChange);

  return () => {
    unsubClick();
    unsubMove();
    unsubLeave();
  };
}
