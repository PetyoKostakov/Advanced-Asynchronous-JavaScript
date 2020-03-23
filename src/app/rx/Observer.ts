export interface Observer {
  next(value: any): void;

  error(error: any): void;

  complete(): void;
}
