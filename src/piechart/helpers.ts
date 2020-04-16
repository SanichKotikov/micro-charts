import {
  IPieChartData,
  IPieChartOptions,
  IPieChartTemplate,
  IPieChartSlice,
} from './types';
import {
  CIRCLE,
  START_ANGLE,
  RADIUS_STEP,
  RADIUS_MIN_BORDER,
  ROUND_STEP,
  STROKE_COLOR,
} from './constants';

function getArcAngle(percent: number) {
  return percent * CIRCLE / 100 /* % */;
}

function getArcPoint(center: number, radius: number, angle: number) {
  return [
    center + radius * Math.cos(angle),
    center + radius * Math.sin(angle),
  ];
}

function calcTemplate(
  data: ReadonlyArray<IPieChartData>,
  options: IPieChartOptions,
): ReadonlyArray<IPieChartTemplate> {
  const center = options.size / 2;

  const rStep = options.variable
    ? Math.min(RADIUS_MIN_BORDER / data.length, RADIUS_STEP)
    : 0;

  return data
    .map((item, idx) => ({ percent: item.percent, order: idx }))
    .sort((a, b) => b.percent - a.percent)
    .map((item, idx) => {
      const { percent, order } = item;

      const angle = getArcAngle(percent);
      const radius = options.variable ? (100 - (idx * rStep)) * center / 100 : center;
      const round = (100 - (idx * ROUND_STEP)) * options.round / 100;
      const length = radius * Math.abs(angle);

      return { order, angle, radius, round: Math.min(round, length / 2) };
    });
}

function getRoundedPath(
  center: number,
  tpl: IPieChartTemplate,
  start: number,
  end: number,
): Readonly<Path2D> {
  const rAngle = tpl.round * CIRCLE / (Math.PI * (tpl.radius * 2));

  const [sX0, sY0] = getArcPoint(center, tpl.radius, start);
  const [sX1, sY1] = getArcPoint(center, tpl.radius - tpl.round, start);
  const [sX2, sY2] = getArcPoint(center, tpl.radius, start + rAngle);

  const [eX0, eY0] = getArcPoint(center, tpl.radius, end);
  const [eX2, eY2] = getArcPoint(center, tpl.radius - tpl.round, end);

  const path = new Path2D();

  path.moveTo(center, center);
  path.lineTo(sX1, sY1);
  path.quadraticCurveTo(sX0, sY0, sX2, sY2);
  path.arc(center, center, tpl.radius, start + rAngle, end - rAngle);
  path.quadraticCurveTo(eX0, eY0, eX2, eY2);
  path.closePath();

  return path;
}

export function calc(
  data: ReadonlyArray<IPieChartData>,
  options: IPieChartOptions,
): ReadonlyArray<IPieChartSlice> {
  const center = options.size / 2;

  if (data.length === 1) {
    const path = new Path2D();
    path.arc(center, center, center, 0, CIRCLE);
    return [{ data: data[0], path }];
  }

  const template = calcTemplate(data, options);

  let start = START_ANGLE;

  return data.map((item, idx) => {
    const tpl = template.find(i => i.order === idx);
    if (!tpl) throw new Error();
    const end = start + tpl.angle;

    const path = new Path2D();
    path.moveTo(center, center);
    path.arc(center, center, tpl.radius, start, end);
    path.closePath();

    const view = options.round ? getRoundedPath(center, tpl, start, end) : undefined;
    const result = { data: item, path, view };

    start = end;
    return result;
  });
}

export function draw(
  canvas: HTMLCanvasElement,
  slices: ReadonlyArray<IPieChartSlice>,
  options: IPieChartOptions,
  handler?: (ctx: CanvasRenderingContext2D, path: Path2D, data: IPieChartData) => void,
) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  ctx.lineWidth = options.stroke;
  ctx.strokeStyle = STROKE_COLOR;

  slices.forEach((item) => {
    ctx.fillStyle = item.data.color;
    if (handler) handler(ctx, item.path, item.data);
    const path = item.view || item.path;
    ctx.fill(path);
    if (options.stroke > 0) ctx.stroke(path);
  });
}
