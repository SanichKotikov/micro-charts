export interface IPathData<T = any> {
  path: Path2D;
  data: Readonly<T>;
}

export interface IEventHandlers<C = Function, H = Function> {
  ratio: number;
  onClick?: C;
  onHoverChange?: H;
}

export interface IArguments<P extends IPathData, O extends IEventHandlers> {
  canvas: HTMLCanvasElement;
  paths: ReadonlyArray<Readonly<P>>;
  options: Readonly<O>;
}

export interface IEventFunctions<P extends IPathData, O extends IEventHandlers> {
  moveHandler?: (args: Readonly<IArguments<P, O>>) => void;
}

export interface IHoverData<T> {
  data: Readonly<T>;
  clientX: number;
  clientY: number;
}
