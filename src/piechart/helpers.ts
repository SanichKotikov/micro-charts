import { IPieChartData, IPieChartOptions, IPieChartTemplate, IPieChartSlice } from './types';
import { CIRCLE, START_ANGLE, RADIUS_STEP, RADIUS_MIN_BORDER, ROUND_STEP } from './constants';

function getArcAngle(percent: number) {
  return percent * CIRCLE / 100 /* % */;
}

function getArcPoint(center: number, radius: number, angle: number) {
  return [
    center + radius * Math.cos(angle),
    center + radius * Math.sin(angle),
  ];
}

function calcTemplate(data: IPieChartData[], options: IPieChartOptions): IPieChartTemplate[] {
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

function getRoundedPath(center: number, tpl: IPieChartTemplate, start: number, end: number) {
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

export function setup(canvas: HTMLCanvasElement, options: IPieChartOptions) {
  const { size, ratio } = options;

  canvas.width = size * ratio;
  canvas.height = size * ratio;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(ratio, ratio);
}

export function calc(data: IPieChartData[], options: IPieChartOptions): IPieChartSlice[] {
  const center = options.size / 2;
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
  slices: IPieChartSlice[],
  handler?: (ctx: CanvasRenderingContext2D, path: Path2D, data: IPieChartData) => void,
) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  slices.forEach((item) => {
    ctx.fillStyle = item.data.color;
    if (handler) handler(ctx, item.path, item.data);
    ctx.fill(item.view || item.path);
  });
}
