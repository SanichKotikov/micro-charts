import { ILineChartData, IPoint, ILineChartOptions, IOptions } from './types';

export function calcPadding(levelStroke: number) {
  return levelStroke / 2;
}

export function setup(
  canvas: HTMLCanvasElement,
  options: ILineChartOptions,
): { ctx: CanvasRenderingContext2D, opt: IOptions } {
  const { ratio } = options;
  const { width, height } = canvas;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);

  return { ctx, opt: { ...options, width, height } };
}

export function calcPoints(
  data: ReadonlyArray<ILineChartData>,
  options: IOptions,
): ReadonlyArray<IPoint> {
  const { width, height, levelStroke, top, bottom } = options;

  const border = height * 5 / 100;
  const padding = calcPadding(levelStroke);

  const values = data.map(item => item.value);
  const upper = top ?? Math.ceil(Math.max.apply(null, values));
  const lower = bottom ?? Math.floor(Math.min.apply(null, values));

  const W = width / (data.length - 1);
  const H = (height - (padding * 2) - (border * 2)) / (upper - lower);

  return data.map((item, i) => ({
    x: i * W,
    y: (upper - item.value) * H + padding + border,
  }));
}

export function drawFill(
  ctx: CanvasRenderingContext2D,
  points: ReadonlyArray<IPoint>,
  options: IOptions,
) {
  const { height, width, fill } = options;
  let background: string | CanvasGradient = 'transparent';

  if (Array.isArray(fill)) {
    if (fill.length == 1) background = fill[0];
    else if (fill.length > 1) {
      const step = 1 / (fill.length - 1);
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      fill.forEach((item, i) => {
        gradient.addColorStop(i * step, item);
      });
      background = gradient;
    }
  } else {
    background = fill as string;
  }

  ctx.beginPath();
  ctx.lineTo(0, height);
  points.forEach(({ x, y }) => ctx.lineTo(x, y));
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = background;
  ctx.fill();
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  points: ReadonlyArray<IPoint>,
  options: IOptions,
) {
  if (options.stroke > 0) {
    ctx.beginPath();
    points.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.lineWidth = options.stroke;
    ctx.strokeStyle = options.color;
    ctx.stroke();
  }

  if (options.pointRadius > 0) {
    ctx.fillStyle = options.color;
    points.forEach(({ x, y }, i, self) => {
      if (i !== 0 && i !== self.length - 1) {
        ctx.beginPath();
        ctx.arc(x, y, options.pointRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

export function drawRows(ctx: CanvasRenderingContext2D, options: IOptions) {
  const { levelStroke, levelCount } = options;
  if (!Number.isFinite(levelCount) || levelCount <= 0 || levelStroke <= 0) return;

  const { width, height } = options;
  const count = Math.ceil(levelCount);
  const padding = calcPadding(levelStroke);
  const L = (height - padding * 2) / count;

  for (let i = 0; i < count + 1; i++) {
    const y = (i * L) + padding;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.lineWidth = levelStroke;
    ctx.strokeStyle = options.levelColor;
    ctx.stroke();
  }
}
