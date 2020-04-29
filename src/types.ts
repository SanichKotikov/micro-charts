export interface IPathData<T = any> {
  path: Path2D;
  data: Readonly<T>;
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

export interface ILevelOptions {
  top?: number;
  bottom?: number;
  rowCount: number;
  rowStroke: number;
  rowColor: string;
  rowMargin: number;
  rowFont?: string;
  rowSkeleton?: boolean;
  rowFontAlign: 'left' | 'right';
  rowFontColor?: string;
}

export interface IDrawLevelOptions extends IEventHandlers, ILevelOptions, ISize, IPadding {
  top: number;
  bottom: number;
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
