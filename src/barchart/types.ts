import {
  IPathBarData,
  ISize,
  IPadding,
  IEdges,
  IFooterOptions,
  ILevelOptions,
  IBarOptions,
  IHoverData,
  IEventHandlers,
} from '../types';

export interface IBarChartData {
  id: string;
  values: ReadonlyArray<number>;
  label?: string;
}

export type IBarData = IPathBarData<IBarChartData>;

export type BarChartClickHandler = (data: Readonly<IBarChartData>) => void;
export type BarChartHoverHandler = (value?: IHoverData<Readonly<IBarChartData>>) => void;
type EventHandlers = IEventHandlers<BarChartClickHandler, BarChartHoverHandler>;

export interface IBarChartOptions extends EventHandlers, ILevelOptions, IBarOptions {
  hoverColor: string;
}

export type IOptions = IBarChartOptions & IPadding & ISize & IEdges & IFooterOptions;
