import {
  ICanvas,
  IDrawData,
  IEdges,
  IEventHandlers,
  IGeometry,
  IHoverData,
  IHoverOptions,
  ILineOptions,
  IPoint,
  IRowOptions,
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

export type ILineChartOptions =
  ICanvas &
  EventHandlers &
  IHoverOptions &
  Partial<IEdges> &
  IRowOptions &
  ILineOptions &
  { hoverType: 'point' | 'segment'; }

export type IOptions = ILineChartOptions & IGeometry;
