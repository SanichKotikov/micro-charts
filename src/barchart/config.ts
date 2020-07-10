import { IBarChartOptions } from './types';
import { BAR_OPTIONS, HOVER_COLOR, ROW_OPTIONS } from '../config';

export const OPTIONS: Readonly<IBarChartOptions> = {
  ratio: window.devicePixelRatio || 1,
  bottom: 0,
  ...ROW_OPTIONS,
  ...BAR_OPTIONS,
  hoverColor: HOVER_COLOR,
};
