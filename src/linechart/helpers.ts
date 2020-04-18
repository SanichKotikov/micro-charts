import { ILineChartData, IPoint, IOptions } from './types';

export function calcPadding(levelStroke: number) {
  return levelStroke / 2;
}

export function calcPoints(
  data: ReadonlyArray<Readonly<ILineChartData>>,
  options: Readonly<IOptions>,
): ReadonlyArray<Readonly<IPoint>> {
  const { width, height, levelStroke, top, bottom, hoverType, onClick, onHoverChange } = options;

  const border = height * 5 / 100;
  const padding = calcPadding(levelStroke);

  const values = data.map(item => item.value);
  const upper = top ?? Math.ceil(Math.max.apply(null, values));
  const lower = bottom ?? Math.floor(Math.min.apply(null, values));

  const W = width / (data.length - 1);
  const H = (height - (padding * 2) - (border * 2)) / (upper - lower);

  return data.map((item, i) => {
    const x = i * W;
    const y = (upper - item.value) * H + padding + border;
    const path = new Path2D();

    if (onClick || onHoverChange) {
      hoverType === 'segment'
        ? path.rect((i - 1) * W, 0, W, height)
        : path.arc(x, y, options.pointRadius * 6, 0, Math.PI * 2);
    }

    return { data: item, x, y, path };
  });
}

export function drawFill(
  ctx: CanvasRenderingContext2D,
  points: ReadonlyArray<Readonly<IPoint>>,
  options: Readonly<IOptions>,
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
  points: ReadonlyArray<Readonly<IPoint>>,
  options: Readonly<IOptions>,
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

export function drawRows(ctx: CanvasRenderingContext2D, options: Readonly<IOptions>) {
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

export function draw(
  canvas: HTMLCanvasElement,
  points: ReadonlyArray<Readonly<IPoint>>,
  options: Readonly<IOptions>,
) {
  const { width, height } = options;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  ctx.clearRect(0, 0, width, height);
  drawFill(ctx, points, options);
  drawLine(ctx, points, options);
  drawRows(ctx, options);
}
