import {
  IBarOptions,
  ICanvas,
  IDrawBarData,
  IEdges,
  IEventHandlers,
  IGeometry,
  IHoverData,
  IHoverOptions,
  IRowOptions,
} from '../types';

export interface IBarChartData {
  id: string;
  values: ReadonlyArray<number>;
  label?: string;
}

export type IBarData = IDrawBarData<IBarChartData>;

export type BarChartClickHandler = (data: Readonly<IBarChartData>) => void;
export type BarChartHoverHandler = (value?: IHoverData<Readonly<IBarChartData>>) => void;
type EventHandlers = IEventHandlers<BarChartClickHandler, BarChartHoverHandler>;

export type IBarChartOptions = ICanvas & EventHandlers & IHoverOptions & Partial<IEdges> & IRowOptions & IBarOptions;
export type IOptions = IBarChartOptions & IGeometry;
