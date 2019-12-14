export interface ILineChartData<T = any> {
  readonly id: T,
  readonly value: number,
}

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
}

export interface IOptions extends ILineChartOptions {
  readonly width: number;
  readonly height: number;
}
