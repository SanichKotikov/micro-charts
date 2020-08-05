import type { ILineBarOptions } from './types';
import { BAR_OPTIONS, HOVER_COLOR, LINE_OPTIONS, ROW_OPTIONS } from '../config';

export const OPTIONS: Readonly<ILineBarOptions> = {
  ratio: window.devicePixelRatio || 1,
  bottom: 0,
  ...ROW_OPTIONS,
  ...LINE_OPTIONS,
  ...BAR_OPTIONS,
  hoverColor: HOVER_COLOR,
};
