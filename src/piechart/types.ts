import { IPathData, IHoverData, IEventHandlers } from '../types';

export interface IPieChartData {
  id: string;
  percent: number;
  color: string;
}

export interface IPieChartSlice extends IPathData<IPieChartData> {}

export type PieChartClickHandler = (data: Readonly<IPieChartData>) => void;
export type PieChartHoverHandler = (value?: IHoverData<Readonly<IPieChartData>>) => void;

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
