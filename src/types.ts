export interface IDrawData<T = any> {
  mask: Path2D;
  data: Readonly<T>;
}

export interface IDrawBarData<T = any> extends IDrawData<T> {
  bars: ReadonlyArray<Path2D>;
}

export interface ICanvas {
  ratio: number;
}

export interface IEventHandlers<C = Function, H = Function> {
  onClick?: C;
  onHoverChange?: H;
}

export interface IHoverOptions {
  hoverColor: string;
}

export interface IParams<P extends IDrawData, O extends IEventHandlers> {
  canvas: HTMLCanvasElement;
  drawData: ReadonlyArray<Readonly<P>>;
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

export type IGeometry = ISize & IPadding & IEdges & IFooterOptions;

export interface IRowOptions {
  rowCount: number;
  rowStroke: number;
  rowColor: string;
  rowMargin: number;
  rowFont?: string;
  rowFontSize: number;
  rowSkeleton?: boolean;
  rowFontAlign: 'left' | 'right';
  rowFontColor?: string;
  rowRenderValue?: (value: number) => string;
  footerColor?: string;
  footerMargin: number;
}

export interface ILineOptions {
  lineStroke: number;
  lineSmooth?: boolean;
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

export type IDrawBarOptions = IEventHandlers & IBarOptions;
export type IDrawLevelOptions = IEventHandlers & IRowOptions & IGeometry;
export type IDrawLineOptions = IDrawLevelOptions & ILineOptions;

export interface IHoverRenderData<P extends IDrawData> {
  items: ReadonlyArray<Readonly<P>>;
  fill: (color?: string) => string;
}

export interface IHoverData<T> {
  data: Readonly<T>;
  clientX: number;
  clientY: number;
}
