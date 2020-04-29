import { IBarChartOptions } from './types';

export const OPTIONS: Readonly<IBarChartOptions> = {
  ratio: window.devicePixelRatio || 1,
  fill: ['#4e5098'],
  barWidth: 10,
  barMargin: 1,
  barRadius: 4,
  rowCount: 3,
  rowStroke: 0.5,
  rowColor: 'rgba(80, 140, 255, 0.5)',
  rowMargin: 4,
  rowFontAlign: 'left',
  hoverColor: 'rgba(80, 140, 255, 0.05)',
};
