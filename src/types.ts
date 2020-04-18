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

export interface IHoverRenderData<P extends IPathData> {
  items: ReadonlyArray<Readonly<P>>;
  fill: (color?: string) => string;
}

export interface IHoverData<T> {
  data: Readonly<T>;
  clientX: number;
  clientY: number;
}
