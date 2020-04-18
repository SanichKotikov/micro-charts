import { IPathData, IHoverData, IEventHandlers } from '../types';

export interface IPieChartData<T = any> {
  id: T;
  percent: number;
  color: string;
}

export interface IPieChartSlice extends IPathData<IPieChartData> {
  view?: Path2D;
}

export type PieChartClickHandler = <T>(data: Readonly<IPieChartData<T>>) => void;
export type PieChartHoverHandler = <T>(value?: IHoverData<Readonly<IPieChartData<T>>>) => void;

export interface IPieChartOptions extends IEventHandlers<PieChartClickHandler, PieChartHoverHandler> {
  size: number;
  round: number;
  variable: boolean;
  stroke: number;
}

export interface IPieChartTemplate {
  order: number;
  angle: number;
  radius: number;
  round: number;
}
