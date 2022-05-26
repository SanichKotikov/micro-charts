import type { ICanvas, IDrawData, IEventHandlers, IHoverRenderData, IParams } from './types';
import { isDrawBarData, getCanvasPoint } from './core';

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

function findDataIndex(
  ctx: CanvasRenderingContext2D,
  paths: readonly Path2D[],
  cX: number,
  cY: number,
): number | undefined {
  for (let i = 0; i < paths.length; i++) {
    if (ctx.isPointInPath(paths[i], cX, cY)) return i;
  }
  return undefined;
}

function clickHandler<P extends IDrawData, O extends IEventHandlers & ICanvas>(params: Readonly<IParams<P, O>>) {
  const canvas = params.canvas;
  const { ratio, onClick } = params.options;

  return (event: MouseEvent) => {
    if (!onClick) return;

    let dataIndex: number | undefined;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const [cX, cY] = getCanvasPoint(canvas, ratio, event);

    for (let i = 0; i < params.drawData.length; i++) {
      const item = params.drawData[i];

      if (ctx.isPointInPath(item.mask, cX, cY)) {
        if (isDrawBarData(item)) dataIndex = findDataIndex(ctx, item.bars, cX, cY);
        onClick(item.data, dataIndex);
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
      let dataIndex: number | undefined;

      const [cX, cY] = getCanvasPoint(canvas, ratio, event);
      drawFunc(params);

      const { items, fill } = getData();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (ctx.isPointInPath(item.mask, cX, cY)) {
          ctx.fillStyle = fill(item.data.color);
          ctx.fill(item.mask);
          cursor = 'pointer';
          found = item.data;

          if (isDrawBarData(item)) {
            dataIndex = findDataIndex(ctx, item.bars, cX, cY);
          }

          break;
        }
      }

      onHoverChange(found && {
        data: found,
        clientX: event.clientX,
        clientY: event.clientY,
        ...(dataIndex !== undefined && { dataIndex }),
      });

      if (onClick) canvas.style.cursor = cursor;
    };
  };
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
    };
  };
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
