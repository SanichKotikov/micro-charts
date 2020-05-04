import { ILineChartOptions } from './types';

export const OPTIONS: Readonly<ILineChartOptions> = {
  ratio: window.devicePixelRatio || 1,
  lineStroke: 0.5,
  lineColor: '#4e5098',
  lineFill: ['rgba(130, 210, 255, 0)', 'rgba(130, 210, 255, 0.3)'],
  pointRadius: 2,
  rowCount: 3,
  rowStroke: 0.5,
  rowColor: 'rgba(80, 140, 255, 0.5)',
  rowMargin: 4,
  rowFontSize: 8,
  rowFontAlign: 'left',
  footerMargin: 8,
  hoverType: 'point',
  hoverColor: 'rgba(80, 140, 255, 0.05)',
};
