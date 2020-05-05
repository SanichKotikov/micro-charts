import { ILineChartOptions } from './types';
import { HOVER_COLOR, ROW_OPTIONS, LINE_OPTIONS } from '../config';

export const OPTIONS: Readonly<ILineChartOptions> = {
  ratio: window.devicePixelRatio || 1,
  ...ROW_OPTIONS,
  ...LINE_OPTIONS,
  hoverType: 'point',
  hoverColor: HOVER_COLOR,
};
