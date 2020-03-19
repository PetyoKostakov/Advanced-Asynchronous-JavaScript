import { Observer } from '../interfaces/Observer';
import { Subscribtion } from './Subscribtion';

export class Observable {

  private _subscribe: (observer: Observer) => Subscribtion;

  constructor(subscribe: (observer: Observer) => Subscribtion) {
    this._subscribe = subscribe;
  }

  subscribe(observer: Observer) {
    return this._subscribe(observer);
  }

  map(projection: (a: any) => any) {
    return new Observable((observer: Observer) => {
      return this.subscribe({
        next: (result: any) => {
          observer.next(projection(result));
        },
        error(e: any): void {
          observer.error(e);
        },
        complete(): void {
          observer.complete();
        }
      });
    });
  }

  filter(predicate: (a: any) => any) {
    return new Observable((observer: Observer) => {
      return this.subscribe({
        next: (prevResult: any) => {
          const result = predicate(prevResult);

          if (result) {
            observer.next(result);
          }
        },
        error(e: any): void {
          observer.error(e);
        },
        complete(): void {
          observer.complete();
        }
      });
    });
  }
}
