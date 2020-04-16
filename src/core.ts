import { IArguments, IEventHandlers, IEventFunctions } from './types';

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

export function subscriber<P, O>(args: IArguments<P, O>) {
  const { canvas } = args;
  return (
    event: string,
    func: ((args: IArguments<P, O>) => void) | undefined,
    callback: Function | undefined,
  ) => {
    const handler = callback && func && func(args);
    if (handler) canvas.addEventListener(event, handler);
    return () => handler && canvas.removeEventListener(event, handler);
  };
}

export function handleEvents<P, O extends IEventHandlers>(
  args: IArguments<P, O>,
  handlers: IEventFunctions<P, O>,
) {
  const sub = subscriber(args);
  const { onClick, onHoverChange } = args.options;

  const unsubClick = sub('click', handlers.clickHandler, onClick);
  const unsubMove = sub('mousemove', handlers.moveHandler, onHoverChange);
  const unsubLeave = sub('mouseleave', handlers.leaveHandler, onHoverChange);

  return () => {
    unsubClick();
    unsubMove();
    unsubLeave();
  };
}
