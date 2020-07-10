import { IBarOptions, ILineOptions, IRowOptions } from './types';

export const HOVER_COLOR = 'rgba(80, 140, 255, 0.05)';

export const ROW_OPTIONS: Readonly<IRowOptions> = {
  rowCount: 3,
  rowStroke: 0.5,
  rowColor: '#bfcbd9',
  rowMargin: 4,
  rowFontSize: 8,
  rowFontAlign: 'left',
  footerMargin: 8,
};

export const LINE_OPTIONS: Readonly<ILineOptions> = {
  lineStroke: 0.5,
  lineColor: '#4e5098',
  lineFill: '#dbecff',
  pointRadius: 2,
};

export const BAR_OPTIONS: Readonly<IBarOptions> = {
  barWidth: 10,
  barColors: ['#4e5098'],
  barMargin: 1,
  barRadius: 4,
};
