export interface ILineChartData<T = any> {
  readonly id: T,
  readonly value: number,
}

export interface IPoint {
  readonly data: ILineChartData;
  readonly x: number;
  readonly y: number;
  readonly segment: Path2D;
}

export interface ILineChartHoverData {
  readonly data: ILineChartData;
  readonly clientX: number;
  readonly clientY: number;
}

export type LineChartHoverHandler = (value: ILineChartHoverData | undefined) => void;

export interface ILineChartOptions {
  readonly ratio: number;
  readonly stroke: number;
  readonly color: string;
  readonly fill: string | ReadonlyArray<string>;
  readonly pointRadius: number;
  readonly levelCount: number;
  readonly levelStroke: number;
  readonly levelColor: string;
  readonly top?: number;
  readonly bottom?: number;
  readonly hoverType: 'point' | 'segment';
  readonly hoverColor: string;
  readonly onHoverChange?: LineChartHoverHandler;
}

export interface IOptions extends ILineChartOptions {
  readonly width: number;
  readonly height: number;
}
