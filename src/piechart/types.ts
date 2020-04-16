import { IHoverData } from '../types';

export interface IPieChartData<T = any> {
  id: T;
  percent: number;
  color: string;
}

export interface IPieChartSlice {
  data: Readonly<IPieChartData>;
  path: Path2D;
  view?: Path2D;
}

export type PieChartClickHandler = (data: Readonly<IPieChartData>) => void;
export type PieChartHoverHandler = (value?: IHoverData<Readonly<IPieChartData>>) => void;

export interface IPieChartOptions {
  ratio: number;
  size: number;
  round: number;
  variable: boolean;
  stroke: number;
  onClick?: PieChartClickHandler;
  onHoverChange?: PieChartHoverHandler;
}

export interface IPieChartTemplate {
  order: number;
  angle: number;
  radius: number;
  round: number;
}
