export interface IComponent {
  start?(): Promise<void>;
  startAtSupervisor?(): Promise<void>;
  stop?(): Promise<void>;
  stopAtSupervisor?(): Promise<void>;
}

export interface IComponentConstructor {
  new(ctx: any): IComponent;
}
