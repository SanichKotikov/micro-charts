import { IPathData, IHoverData, IEventHandlers } from '../types';

export interface ILineChartData {
  id: string,
  value: number,
}

export interface IPoint extends IPathData<ILineChartData> {
  x: number;
  y: number;
}

export type LineChartClickHandler = (data: Readonly<ILineChartData>) => void;
export type LineChartHoverHandler = (value?: IHoverData<Readonly<ILineChartData>>) => void;

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
