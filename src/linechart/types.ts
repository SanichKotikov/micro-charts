import {
  IDrawData,
  ICanvas,
  IPoint,
  IGeometry,
  IRowOptions,
  IHoverData,
  IEventHandlers,
  IHoverOptions,
  ILineOptions,
} from '../types';

export interface ILineChartData {
  id: string,
  value: number,
  label?: string,
}

export type ILineData = IDrawData<ILineChartData> & IPoint;

export type LineChartClickHandler = (data: Readonly<ILineChartData>) => void;
export type LineChartHoverHandler = (value?: IHoverData<Readonly<ILineChartData>>) => void;
type EventHandlers = IEventHandlers<LineChartClickHandler, LineChartHoverHandler>;

export interface ILineChartOptions extends ICanvas, EventHandlers, IHoverOptions, IRowOptions, ILineOptions {
  hoverType: 'point' | 'segment';
}

export type IOptions = ILineChartOptions & IGeometry;
