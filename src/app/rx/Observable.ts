import { Observer } from '../interfaces/Observer';
import { Subscribtion } from './Subscribtion';

export class Observable {

  private _subscribe: (observer: Observer) => Subscribtion;

  constructor(subscribe: (observer: Observer) => Subscribtion) {
    this._subscribe = subscribe;
  }

  static zip(...obs: any[]) {
    return new Observable((observer: Observer) => {
      const observablesCount = obs.length;
      const result = [];
      let resolvedObservablesCount = 0;

      obs.forEach((observable: Observable, index: number) => {
        observable.subscribe({
          next(observableResult) {
            result[index] = observableResult;
            resolvedObservablesCount++;

            if (resolvedObservablesCount === observablesCount) {
              observer.next(result);
            }
          },
          error(e) {
          },
          complete() {
          }
        });
      });

      return {
        unsubscribe(): void {
          obs.forEach(observable => observable.unsubscribe());
        }
      };
    });
  }

  static concat(...obs: any[]) {
    return new Observable((observer: Observer) => {
      let currentObsCount = 0;
      executeObserver(obs, currentObsCount);

      function executeObserver(observerArray: Observable[], observerIndex: number) {
        observerArray[observerIndex].subscribe({
          next(value: any): void {
            observer.next(value);
          },
          error(error: any): void {
          },
          complete(): void {
            currentObsCount++;
            if (currentObsCount < observerArray.length) {
              executeObserver(observerArray, currentObsCount);
            } else {
              observer.complete();
            }
          }
        });
      }

      return {
        unsubscribe(): void {
          obs.forEach(observable => observable.unsubscribe());
        }
      };
    });
  }

  subscribe(observer: Observer) {
    return this._subscribe(observer);
  }

  map(projection: (a: any) => any) { /* projection function that extract values */
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
