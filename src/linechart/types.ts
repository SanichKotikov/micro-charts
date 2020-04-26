import { IPathData, IHoverData, IEventHandlers } from '../types';

export interface ILineChartData {
  id: string,
  value: number,
}

export interface IPadding {
  sPadding: number;
  vPadding: number;
}

export interface IEdges {
  top: number;
  bottom: number;
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
  levelFont?: string;
  top?: number;
  bottom?: number;
  hoverType: 'point' | 'segment';
  hoverColor: string;
}

export interface IOptions extends ILineChartOptions, IPadding {
  width: number;
  height: number;
  top: number;
  bottom: number;
}
