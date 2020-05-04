export interface IPathData<T = any> {
  path: Path2D;
  data: Readonly<T>;
}

export interface IPathBarData<T = any> extends IPathData<T> {
  pillars: ReadonlyArray<Path2D>;
}

export interface IEventHandlers<C = Function, H = Function> {
  ratio: number;
  onClick?: C;
  onHoverChange?: H;
}

export interface IParams<P extends IPathData, O extends IEventHandlers> {
  canvas: HTMLCanvasElement;
  paths: ReadonlyArray<Readonly<P>>;
  options: Readonly<O>;
  columns?: ReadonlyArray<string>;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IPadding {
  sPadding: number;
  vPadding: number;
}

export interface IEdges {
  top: number;
  bottom: number;
}

export interface IFooterOptions {
  footer: number;
}

export interface ILevelOptions {
  top?: number;
  bottom?: number;
  rowCount: number;
  rowStroke: number;
  rowColor: string;
  rowMargin: number;
  rowFont?: string;
  rowFontSize: number;
  rowSkeleton?: boolean;
  rowFontAlign: 'left' | 'right';
  rowFontColor?: string;
  footerColor?: string;
  footerMargin: number;
}

export interface ILineOptions {
  lineStroke: number;
  lineColor: string;
  lineFill: string | ReadonlyArray<string>;
  pointRadius: number;
}

export interface IBarOptions {
  barColors: ReadonlyArray<string>,
  barWidth: number;
  barMargin: number;
  barRadius: number;
}

export interface IDrawLevelOptions extends IEventHandlers, ILevelOptions, ISize, IPadding {
  top: number;
  bottom: number;
  footer: number;
}

export interface IDrawBarOptions extends IEventHandlers, IBarOptions {}

export interface IDrawLineOptions extends IEventHandlers, ILevelOptions, ISize, IPadding, ILineOptions {
  footer: number;
}

export interface IHoverRenderData<P extends IPathData> {
  items: ReadonlyArray<Readonly<P>>;
  fill: (color?: string) => string;
}

export interface IHoverData<T> {
  data: Readonly<T>;
  clientX: number;
  clientY: number;
}
