export interface IPieChartData<T = any> {
  id: T;
  percent: number;
  color: string;
}

export interface IPieChartHoverData {
  data: IPieChartData;
  clientX: number;
  clientY: number;
}

export type PieChartHoverHandler = (value: IPieChartHoverData | undefined) => void;

export interface IPieChartOptions {
  ratio: number;
  size: number;
  round: number;
  onHoverChange?: PieChartHoverHandler;
}

export interface IPieChartTemplate {
  order: number;
  angle: number;
  radius: number;
  round: number;
}

export interface IPieChartSlice {
  data: IPieChartData;
  path: Path2D;
  view?: Path2D;
}
