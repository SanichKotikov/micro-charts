import { IPathData, ISize, IPadding, ILevelOptions, IHoverData, IEventHandlers } from '../types';

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
type EventHandlers = IEventHandlers<LineChartClickHandler, LineChartHoverHandler>;

export interface ILineChartOptions extends EventHandlers, ILevelOptions {
  stroke: number;
  color: string;
  fill: string | ReadonlyArray<string>;
  pointRadius: number;
  hoverType: 'point' | 'segment';
  hoverColor: string;
}

export interface IOptions extends ILineChartOptions, IPadding, ISize {
  top: number;
  bottom: number;
}
