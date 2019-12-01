export interface IPieChartData<T = any> {
  readonly id: T;
  readonly percent: number;
  readonly color: string;
}

export interface IPieChartHoverData {
  readonly data: IPieChartData;
  readonly clientX: number;
  readonly clientY: number;
}

export type PieChartHoverHandler = (value: IPieChartHoverData | undefined) => void;

export interface IPieChartOptions {
  readonly ratio: number;
  readonly size: number;
  readonly round: number;
  readonly variable: boolean;
  readonly stroke: number;
  readonly onHoverChange?: PieChartHoverHandler;
}

export interface IPieChartTemplate {
  readonly order: number;
  readonly angle: number;
  readonly radius: number;
  readonly round: number;
}

export interface IPieChartSlice {
  readonly data: IPieChartData;
  readonly path: Path2D;
  readonly view?: Path2D;
}
