import { IHoverData } from '../types';

export interface IPieChartData<T = any> {
  readonly id: T;
  readonly percent: number;
  readonly color: string;
}

export interface IPieChartSlice {
  readonly data: IPieChartData;
  readonly path: Path2D;
  readonly view?: Path2D;
}

export type PieChartClickHandler = (data: IPieChartData) => void;
export type PieChartHoverHandler = (value?: IHoverData<IPieChartData>) => void;

export interface IPieChartOptions {
  readonly ratio: number;
  readonly size: number;
  readonly round: number;
  readonly variable: boolean;
  readonly stroke: number;
  readonly onClick?: PieChartClickHandler;
  readonly onHoverChange?: PieChartHoverHandler;
}

export interface IPieChartTemplate {
  readonly order: number;
  readonly angle: number;
  readonly radius: number;
  readonly round: number;
}
