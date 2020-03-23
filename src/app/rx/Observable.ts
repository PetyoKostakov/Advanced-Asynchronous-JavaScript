import { Observer } from './Observer';
import { Subscription } from './Subscription.interface';

export class Observable {

  private _subscribe: (observer: Observer) => Subscription;

  constructor(subscribe: (observer: Observer) => Subscription) {
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
      let subscription;
      executeObserver(obs, currentObsCount);

      function executeObserver(observerArray: Observable[], observerIndex: number) {
        subscription = observerArray[observerIndex].subscribe({
          next(value: any): void {
            observer.next(value);
          },
          error(error: any): void {
            observer.error(error);
            subscription.unsubscribe();
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
          subscription.unsubscribe();
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

  filter(predicate: (a: any) => any) { /*Predicate function - function that return boolean value*/
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

  retry(num) {
    return new Observable((observer: Observer) => {
      let numberOfTries = 0;
      let subscription;

      function handleSubscription() {
        subscription = this.subscribe({
          next(value: any): void {
            observer.next(value);
          },
          error(error: any): void {
            numberOfTries++;
            if (numberOfTries === num) {
              observer.error(error);
            } else {
              subscription.unsubscribe();
              handleSubscription();
            }
          },
          complete(): void {
            observer.complete();
          }
        });
      }

      handleSubscription();

      return {
        unsubscribe(): void {
          subscription.unsubscribe();
        }
      };
    });
  }
}
