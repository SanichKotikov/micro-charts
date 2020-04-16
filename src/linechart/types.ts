import { IHoverData } from '../types';

export interface ILineChartData<T = any> {
  id: T,
  value: number,
}

export interface IPoint {
  data: Readonly<ILineChartData>;
  x: number;
  y: number;
  segment: Path2D;
}

export type LineChartHoverHandler = (value?: IHoverData<Readonly<ILineChartData>>) => void;

export interface ILineChartOptions {
  ratio: number;
  stroke: number;
  color: string;
  fill: string | ReadonlyArray<string>;
  pointRadius: number;
  levelCount: number;
  levelStroke: number;
  levelColor: string;
  top?: number;
  bottom?: number;
  hoverType: 'point' | 'segment';
  hoverColor: string;
  onHoverChange?: LineChartHoverHandler;
}

export interface IOptions extends ILineChartOptions {
  width: number;
  height: number;
}
