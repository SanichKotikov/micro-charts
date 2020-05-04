import { ILineBarOptions } from './types';

export const OPTIONS: Readonly<ILineBarOptions> = {
  ratio: window.devicePixelRatio || 1,
  bottom: 0,
  lineStroke: 0.5,
  lineColor: '#4e5098',
  lineFill: ['rgba(130, 210, 255, 0)', 'rgba(130, 210, 255, 0.3)'],
  pointRadius: 2,
  barWidth: 10,
  barColors: ['#4e5098'],
  barMargin: 1,
  barRadius: 4,
  rowCount: 3,
  rowStroke: 0.5,
  rowColor: 'rgba(80, 140, 255, 0.5)',
  rowMargin: 4,
  rowFontSize: 8,
  rowFontAlign: 'left',
  footerMargin: 8,
  hoverColor: 'rgba(80, 140, 255, 0.05)',
};
