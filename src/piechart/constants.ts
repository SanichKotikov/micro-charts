import { IPieChartOptions } from './types';

export const CIRCLE = Math.PI * 2;
export const START_ANGLE = Math.PI * -0.5;

export const RADIUS_STEP = 6; // %
export const RADIUS_MIN_BORDER = 40; // %

export const ROUND_STEP = 4; // %

export const STROKE_COLOR = '#fff';

export const OPTIONS: IPieChartOptions = {
  ratio: window.devicePixelRatio || 1,
  size: 200,
  round: 0,
  variable: false,
  stroke: 0,
};
