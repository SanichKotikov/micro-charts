import { IPathData, ISize, IPadding, ILevelOptions, IHoverData, IEventHandlers } from '../types';

export interface IBarChartData {
  id: string;
  values: ReadonlyArray<number>;
}

export interface IBarData extends IPathData<IBarChartData> {
  pillars: ReadonlyArray<Path2D>;
}

export type BarChartClickHandler = (data: Readonly<IBarChartData>) => void;
export type BarChartHoverHandler = (value?: IHoverData<Readonly<IBarChartData>>) => void;
type EventHandlers = IEventHandlers<BarChartClickHandler, BarChartHoverHandler>;

export interface IBarChartOptions extends EventHandlers, ILevelOptions {
  fill: ReadonlyArray<string>,
  barWidth: number;
  barMargin: number;
  barRadius: number;
  hoverColor: string;
}

export interface IOptions extends IBarChartOptions, IPadding, ISize {
  top: number;
  bottom: number;
}
