export interface IArguments<P, O> {
  canvas: HTMLCanvasElement;
  paths: ReadonlyArray<P>;
  options: O;
}

export interface IEventHandlers {
  onClick?: Function;
  onHoverChange?: Function;
}

export interface IEventFunctions<P, O> {
  clickHandler?: (args: IArguments<P, O>) => void;
  moveHandler?: (args: IArguments<P, O>) => void;
  leaveHandler?: (args: IArguments<P, O>) => void;
}

export interface IHoverData<T> {
  readonly data: T;
  readonly clientX: number;
  readonly clientY: number;
}
