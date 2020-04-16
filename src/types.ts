export interface IArguments<P, O> {
  canvas: HTMLCanvasElement;
  paths: ReadonlyArray<Readonly<P>>;
  options: Readonly<O>;
}

export interface IEventHandlers {
  onClick?: Function;
  onHoverChange?: Function;
}

export interface IEventFunctions<P, O> {
  clickHandler?: (args: Readonly<IArguments<P, O>>) => void;
  moveHandler?: (args: Readonly<IArguments<P, O>>) => void;
  leaveHandler?: (args: Readonly<IArguments<P, O>>) => void;
}

export interface IHoverData<T> {
  data: Readonly<T>;
  clientX: number;
  clientY: number;
}
