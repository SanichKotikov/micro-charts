import {
  IPoint,
  IPathBarData,
  IHoverData,
  IEventHandlers,
  ILevelOptions,
  ILineOptions,
  IBarOptions,
  IPadding,
  ISize,
  IEdges,
  IFooterOptions,
} from '../types';

export interface ILineBarData {
  id: string;
  value: number;
  bars: ReadonlyArray<number>;
  label?: string;
}

export type IData = IPathBarData<ILineBarData> & IPoint;

export type LineChartClickHandler = (data: Readonly<ILineBarData>) => void;
export type LineChartHoverHandler = (value?: IHoverData<Readonly<ILineBarData>>) => void;
type EventHandlers = IEventHandlers<LineChartClickHandler, LineChartHoverHandler>;

export interface ILineBarOptions extends EventHandlers, ILevelOptions, ILineOptions, IBarOptions {
  hoverColor: string;
}

export type IOptions = ILineBarOptions & IPadding & ISize & IEdges & IFooterOptions;
