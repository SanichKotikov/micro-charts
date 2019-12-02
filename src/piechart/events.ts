import { IPieChartData, IPieChartSlice, IPieChartOptions } from './types';
import { HOVER_ALPHA } from './constants';
import { draw } from './helpers';

function getEventXY(canvas: HTMLCanvasElement, ratio: number, event: MouseEvent) {
  const { clientX, clientY } = event;
  const { left, top } = canvas.getBoundingClientRect();
  return [(clientX - left) * ratio, (clientY - top) * ratio];
}

function onClick(
  canvas: HTMLCanvasElement,
  slices: ReadonlyArray<IPieChartSlice>,
  options: IPieChartOptions,
) {
  return (event: MouseEvent) => {
    if (!options.onClick) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const [cX, cY] = getEventXY(canvas, options.ratio, event);

    for (let i = 0; i < slices.length; i++) {
      const { path, data } = slices[i];

      if (ctx.isPointInPath(path, cX, cY)) {
        options.onClick(data);
        return;
      }
    }
  };
}

function onMouseMove(
  canvas: HTMLCanvasElement,
  slices: ReadonlyArray<IPieChartSlice>,
  options: IPieChartOptions,
) {
  return (event: MouseEvent) => {
    if (!options.onHoverChange) return;

    let found: IPieChartData | undefined = undefined;
    const [cX, cY] = getEventXY(canvas, options.ratio, event);

    draw(canvas, slices, options, (ctx, path, data) => {
      if (found === undefined && ctx.isPointInPath(path, cX, cY)) {
        ctx.globalAlpha = HOVER_ALPHA;
        found = data;
        return;
      }
      ctx.globalAlpha = 1;
    });

    const { clientX, clientY } = event;
    options.onHoverChange(found && { data: found, clientX, clientY });
  };
}

function onMouseLeave(
  canvas: HTMLCanvasElement,
  slices: ReadonlyArray<IPieChartSlice>,
  options: IPieChartOptions,
) {
  return () => {
    draw(canvas, slices, options);
    if (options.onHoverChange) options.onHoverChange(undefined);
  }
}

function subscriber(
  canvas: HTMLCanvasElement,
  slices: ReadonlyArray<IPieChartSlice>,
  options: IPieChartOptions,
) {
  return (event: string, func: Function, callback: Function | undefined) => {
    const handler = callback && func(canvas, slices, options);
    if (handler) canvas.addEventListener(event, handler);
    return () => handler && canvas.removeEventListener(event, handler);
  }
}

export function handleEvents(
  canvas: HTMLCanvasElement,
  slices: ReadonlyArray<IPieChartSlice>,
  options: IPieChartOptions,
) {
  const sub = subscriber(canvas, slices, options);

  const unsubClick = sub('click', onClick, options.onClick);
  const unsubMove = sub('mousemove', onMouseMove, options.onHoverChange);
  const unsubLeave = sub('mouseleave', onMouseLeave, options.onHoverChange);

  return () => {
    unsubClick();
    unsubMove();
    unsubLeave();
  };
}
