import {
  IPathData,
  IPoint,
  ISize,
  IPadding,
  IEdges,
  IFooterOptions,
  ILevelOptions,
  IHoverData,
  IEventHandlers,
  ILineOptions,
} from '../types';

export interface ILineChartData {
  id: string,
  value: number,
  label?: string,
}

export type ILineData = IPathData<ILineChartData> & IPoint;

export type LineChartClickHandler = (data: Readonly<ILineChartData>) => void;
export type LineChartHoverHandler = (value?: IHoverData<Readonly<ILineChartData>>) => void;
type EventHandlers = IEventHandlers<LineChartClickHandler, LineChartHoverHandler>;

export interface ILineChartOptions extends EventHandlers, ILevelOptions, ILineOptions {
  hoverType: 'point' | 'segment';
  hoverColor: string;
}

export type IOptions = ILineChartOptions & IPadding & ISize & IEdges & IFooterOptions;
