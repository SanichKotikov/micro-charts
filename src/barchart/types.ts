import type {
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

export interface IBarHoverData<T> extends IHoverData<T> {dataIndex: number;}

export type BarChartClickHandler = (data: Readonly<IBarChartData>, dataIndex: number | undefined) => void;
export type BarChartHoverHandler = (value?: IBarHoverData<Readonly<IBarChartData>>) => void;
type EventHandlers = IEventHandlers<BarChartClickHandler, BarChartHoverHandler>;

export type IBarChartOptions = ICanvas & EventHandlers & IHoverOptions & Partial<IEdges> & IRowOptions & IBarOptions;
export type IOptions = IBarChartOptions & IGeometry;
