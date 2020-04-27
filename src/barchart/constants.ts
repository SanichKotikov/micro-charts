import { IBarChartOptions } from './types';

export const OPTIONS: Readonly<IBarChartOptions> = {
  ratio: window.devicePixelRatio || 1,
  fill: ['#4e5098'],
  barWidth: 10,
  barMargin: 1,
  barRadius: 4,
  levelCount: 3,
  levelStroke: 0.5,
  levelColor: 'rgba(80, 140, 255, 0.5)',
  hoverColor: 'rgba(80, 140, 255, 0.05)',
};
