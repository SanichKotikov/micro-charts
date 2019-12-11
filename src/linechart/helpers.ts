import { ILineChartData, ILineChartOptions, IOptions } from './types';

export function setup(canvas: HTMLCanvasElement, options: ILineChartOptions): IOptions {
  const { ratio } = options;
  const { width, height } = canvas;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(ratio, ratio);

  return { ...options, width, height };
}

export function draw(canvas: HTMLCanvasElement, data: ReadonlyArray<ILineChartData>, options: IOptions) {
  const { width, height, levelStroke } = options;

  const border = height * 5 / 100;
  const padding = levelStroke / 2;

  const values = data.map(item => item.value);

  const upper = Math.ceil(Math.max.apply(null, values));
  const lower = Math.floor(Math.min.apply(null, values));

  const W = width / (data.length - 1);
  const H = (height - (padding * 2) - (border * 2)) / (upper - lower);

  const points = data.map((item, i) => ({
    x: i * W,
    y: (upper - item.value) * H + padding + border,
  }));

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, width, height);

  // fill
  const fill = options.fill;
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

  // line
  if (options.stroke > 0) {
    ctx.beginPath();
    points.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.lineWidth = options.stroke;
    ctx.strokeStyle = options.color;
    ctx.stroke();
  }

  // points
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

  // levels
  const levelCount = options.levelCount;

  if (Number.isFinite(levelCount) && levelCount > 0 && levelStroke > 0) {
    const count = Math.ceil(levelCount);
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
}
