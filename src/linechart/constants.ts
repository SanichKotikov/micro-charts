import { ILineChartOptions } from './types';

export const OPTIONS: ILineChartOptions = {
  ratio: window.devicePixelRatio || 1,
  stroke: 0.5,
  color: '#4e5098',
  fill: ['rgba(130, 210, 255, 0)', 'rgba(130, 210, 255, 0.3)'],
  pointRadius: 2,
  levelCount: 3,
  levelStroke: 0.5,
  levelColor: 'rgba(80, 140, 255, 0.5)',
};
