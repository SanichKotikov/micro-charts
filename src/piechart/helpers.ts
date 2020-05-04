import { IParams } from '../types';
import { clearCanvas } from '../draw';
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

export function adjustColor(color: string, amount: number) {
  return '#' + color.replace(/^#/, '').replace(/../g, (color) => {
    return ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2);
  });
}

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
  data: ReadonlyArray<Readonly<IPieChartData>>,
  options: Readonly<IPieChartOptions>,
): ReadonlyArray<Readonly<IPieChartTemplate>> {
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
  tpl: Readonly<IPieChartTemplate>,
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
  data: ReadonlyArray<Readonly<IPieChartData>>,
  options: Readonly<IPieChartOptions>,
): ReadonlyArray<Readonly<IPieChartSlice>> {
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

    let path = new Path2D();

    if (!options.round) {
      path.moveTo(center, center);
      path.arc(center, center, tpl.radius, start, end);
      path.closePath();
    } else {
      path = getRoundedPath(center, tpl, start, end);
    }

    start = end;
    return { data: item, path };
  });
}

export function draw(params: Readonly<IParams<IPieChartSlice, IPieChartOptions>>) {
  const { canvas, paths, options } = params;
  clearCanvas(canvas, canvas.width, canvas.height);

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  ctx.lineWidth = options.stroke;
  ctx.strokeStyle = STROKE_COLOR;

  paths.forEach((item) => {
    ctx.fillStyle = item.data.color;
    ctx.fill(item.path);
    if (options.stroke > 0) ctx.stroke(item.path);
  });
}
