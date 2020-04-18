import { IPathData, IHoverData, IEventHandlers } from '../types';

export interface ILineChartData<T = any> {
  id: T,
  value: number,
}

export interface IPoint extends IPathData<ILineChartData> {
  x: number;
  y: number;
}

export type LineChartClickHandler = <T>(data: Readonly<ILineChartData<T>>) => void;
export type LineChartHoverHandler = <T>(value?: IHoverData<Readonly<ILineChartData<T>>>) => void;

export interface ILineChartOptions extends IEventHandlers<LineChartClickHandler, LineChartHoverHandler> {
  stroke: number;
  color: string;
  fill: string | ReadonlyArray<string>;
  pointRadius: number;
  levelCount: number;
  levelStroke: number;
  levelColor: string;
  top?: number;
  bottom?: number;
  hoverType: 'point' | 'segment';
  hoverColor: string;
}

export interface IOptions extends ILineChartOptions {
  width: number;
  height: number;
}
