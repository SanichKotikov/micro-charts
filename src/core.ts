import {
  IPathData,
  IParams,
  IPadding,
  IEdges,
  IEventHandlers,
  IDrawLevelOptions,
  IHoverRenderData,
} from './types';

export function pipe(...fus: Function[]) {
  return <T>(init: T) => fus.reduce((res, fn) => fn(res), init);
}

export function calcEdges(values: number[], top?: number, bottom?: number): Readonly<IEdges> {
  let upper = top ?? Math.max.apply(null, values);
  let lower = bottom ?? Math.min.apply(null, values);
  const shift = (upper - lower) * 5 / 100;

  if (typeof top !== 'number') upper = Math.ceil(upper + shift);
  if (typeof bottom !== 'number') lower = Math.floor(lower - shift)

  return { top: upper, bottom: lower };
}

export function calcPadding(
  canvas: HTMLCanvasElement,
  edges: IEdges,
  levelStroke: number,
  levelFont?: string,
): Readonly<IPadding> {
  const stroke = levelStroke / 2;
  if (!levelFont) return { sPadding: 0, vPadding: stroke };

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.font = levelFont;

  const labels = [edges.top, edges.bottom]
    .map(num => Math.round(num).toString())
    .sort((a, b) => b.length - a.length);

  const { actualBoundingBoxAscent, width } = ctx.measureText(labels[0]);

  return {
    sPadding: Math.ceil(width + 2), // font width, plus 2px
    vPadding: Math.max(stroke, actualBoundingBoxAscent / 2),
  };
}

export function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number, ratio: number) {
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(ratio, ratio);
}

export function clearCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, width, height);
}

export function drawLevels<O extends IDrawLevelOptions>(params: IParams<any, O>) {
  const { canvas, options } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const { levelStroke, levelCount } = options;
  if (!Number.isFinite(levelCount) || levelCount <= 0 || levelStroke <= 0) return params;

  const { width, height, top, bottom, sPadding, vPadding, levelColor, levelFont } = options;
  const count = Math.ceil(levelCount);
  const L = (height - vPadding * 2) / count;

  const step = (top - bottom) / count;

  for (let i = 0; i < count + 1; i++) {
    const y = (i * L) + vPadding;

    ctx.beginPath();
    ctx.moveTo(sPadding, y);
    ctx.lineTo(width, y);
    ctx.lineWidth = levelStroke;
    ctx.strokeStyle = levelColor;
    ctx.stroke();

    if (typeof levelFont === 'string') {
      ctx.font = levelFont;
      const label = Math.round(top - (step * i)).toString();
      const { actualBoundingBoxAscent } = ctx.measureText(label);
      ctx.fillStyle = levelColor;
      ctx.fillText(label, 0, y + ((actualBoundingBoxAscent - levelStroke / 2) / 2));
    }
  }

  return params;
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
