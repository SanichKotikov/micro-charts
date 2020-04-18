import { IPathData, IParams, IEventHandlers, IHoverRenderData } from './types';

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

export function subscriber<P extends IPathData, O extends IEventHandlers>(params: Readonly<IParams<P, O>>) {
  const { canvas } = params;
  return (
    event: string,
    func: ((params: Readonly<IParams<P, O>>) => void) | undefined,
    callback: Function | undefined,
  ) => {
    const handler = callback && func && func(params);
    if (handler) canvas.addEventListener(event, handler);
    return () => handler && canvas.removeEventListener(event, handler);
  };
}

function clickHandler<P extends IPathData, O extends IEventHandlers>(params: Readonly<IParams<P, O>>) {
  const canvas = params.canvas;
  const { ratio, onClick } = params.options;

  return (event: MouseEvent) => {
    if (!onClick) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const [cX, cY] = getCanvasPoint(canvas, ratio, event);

    for (let i = 0; i < params.paths.length; i++) {
      const { path, data } = params.paths[i];

      if (ctx.isPointInPath(path, cX, cY)) {
        onClick(data);
        return;
      }
    }
  };
}

function moveHandler<P extends IPathData, O extends IEventHandlers>(
  drawFunc: (params: Readonly<IParams<P, O>>) => void,
  getData: () => IHoverRenderData<P>,
) {
  return (params: Readonly<IParams<P, O>>) => {
    const canvas = params.canvas;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const { ratio, onClick, onHoverChange } = params.options;

    return (event: MouseEvent) => {
      if (!onHoverChange) return;

      let cursor: string = 'default';
      let found: Readonly<any> | undefined;
      const [cX, cY] = getCanvasPoint(canvas, ratio, event);
      drawFunc(params);

      const { items, fill } = getData();

      for (let i = 0; i < items.length; i++) {
        const { data, path } = items[i];

        if (ctx.isPointInPath(path, cX, cY)) {
          ctx.fillStyle = fill(data.color);
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
}

function leaveHandler<P extends IPathData, O extends IEventHandlers>(
  drawFunc: (params: Readonly<IParams<P, O>>) => void,
) {
  return (params: Readonly<IParams<P, O>>) => {
    const canvas = params.canvas;
    const { onClick, onHoverChange } = params.options;

    return () => {
      drawFunc(params);
      if (onHoverChange) onHoverChange(undefined);
      if (onClick) canvas.style.cursor = 'default';
    }
  }
}

export function setupEvents<P extends IPathData, O extends IEventHandlers>(
  params: Readonly<IParams<P, O>>,
  drawFunc: (params: Readonly<IParams<P, O>>) => void,
  getData: () => IHoverRenderData<P>,
) {
  const sub = subscriber(params);
  const { onClick, onHoverChange } = params.options;

  const unsubClick = sub('click', clickHandler, onClick);
  const unsubMove = sub('mousemove', moveHandler(drawFunc, getData), onHoverChange);
  const unsubLeave = sub('mouseleave', leaveHandler(drawFunc), onHoverChange);

  return () => {
    unsubClick();
    unsubMove();
    unsubLeave();
  };
}
