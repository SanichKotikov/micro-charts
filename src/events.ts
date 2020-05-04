import { IDrawData, ICanvas, IParams, IEventHandlers, IHoverRenderData } from './types';
import { getCanvasPoint } from './core';

export function subscriber<P extends IDrawData, O extends IEventHandlers>(params: Readonly<IParams<P, O>>) {
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

function clickHandler<P extends IDrawData, O extends IEventHandlers & ICanvas>(params: Readonly<IParams<P, O>>) {
  const canvas = params.canvas;
  const { ratio, onClick } = params.options;

  return (event: MouseEvent) => {
    if (!onClick) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const [cX, cY] = getCanvasPoint(canvas, ratio, event);

    for (let i = 0; i < params.drawData.length; i++) {
      const { mask, data } = params.drawData[i];

      if (ctx.isPointInPath(mask, cX, cY)) {
        onClick(data);
        return;
      }
    }
  };
}

function moveHandler<P extends IDrawData, O extends IEventHandlers & ICanvas>(
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
        const { data, mask } = items[i];

        if (ctx.isPointInPath(mask, cX, cY)) {
          ctx.fillStyle = fill(data.color);
          ctx.fill(mask);
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

function leaveHandler<P extends IDrawData, O extends IEventHandlers>(
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

export function setupEvents<P extends IDrawData, O extends IEventHandlers & ICanvas>(
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
