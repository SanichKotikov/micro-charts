import {
  IBarOptions,
  ICanvas,
  IDrawBarData,
  IEdges,
  IEventHandlers,
  IGeometry,
  IHoverData,
  IHoverOptions,
  ILineOptions,
  IPoint,
  IRowOptions,
} from '../types';

export interface ILineBarData {
  id: string;
  value: number;
  bars: ReadonlyArray<number>;
  label?: string;
}

export type IData = IDrawBarData<ILineBarData> & IPoint;

export type LineChartClickHandler = (data: Readonly<ILineBarData>) => void;
export type LineChartHoverHandler = (value?: IHoverData<Readonly<ILineBarData>>) => void;
type EventHandlers = IEventHandlers<LineChartClickHandler, LineChartHoverHandler>;

export type ILineBarOptions =
  ICanvas &
  EventHandlers &
  IHoverOptions &
  Partial<IEdges> &
  IRowOptions &
  ILineOptions &
  IBarOptions;

export type IOptions = ILineBarOptions & IGeometry;
