import { IPieChartData, IPieChartSlice, IPieChartOptions } from './types';
import { draw } from './helpers';

function onMouseMove(canvas: HTMLCanvasElement, slices: IPieChartSlice[], options: IPieChartOptions) {
  return (event: MouseEvent) => {
    let found: IPieChartData | undefined = undefined;
    const { ratio } = options;

    const { clientX, clientY } = event;
    const { left, top } = canvas.getBoundingClientRect();

    const cX = (clientX - left) * ratio;
    const cY = (clientY - top) * ratio;

    draw(canvas, slices, (ctx, path, data) => {
      if (found === undefined && ctx.isPointInPath(path, cX, cY)) {
        ctx.globalAlpha = 0.8;
        found = data;
        return;
      }
      ctx.globalAlpha = 1;
    });

    if (options.onHoverChange) {
      options.onHoverChange(found && { data: found, clientX, clientY });
    }
  };
}

function onMouseLeave(canvas: HTMLCanvasElement, slices: IPieChartSlice[], options: IPieChartOptions) {
  return () => {
    draw(canvas, slices);
    if (options.onHoverChange) options.onHoverChange(undefined);
  }
}

export function handleEvents(canvas: HTMLCanvasElement, slices: IPieChartSlice[], options: IPieChartOptions) {
  const moveHandle = options.onHoverChange && onMouseMove(canvas, slices, options);
  const leaveHandle = options.onHoverChange && onMouseLeave(canvas, slices, options);

  if (moveHandle) canvas.addEventListener('mousemove', moveHandle);
  if (leaveHandle) canvas.addEventListener('mouseleave', leaveHandle);

  return () => {
    if (moveHandle) canvas.removeEventListener('mousemove', moveHandle);
    if (leaveHandle) canvas.removeEventListener('mousemove', leaveHandle);
  };
}
