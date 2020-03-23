import { Observable } from './Observable';
import { Observer } from './Observer';

export class Subject extends Observable {

  private observers;

  constructor() {
    super((observer: Observer) => {
      this.observers.add(observer);

      return {
        unsubscribe(): void {
          this.observers.delete(observer);
        }
      };
    });

    this.observers = new Set();
  }

  next(a: any) {
    for (const observer of this.observers) {
      observer.next(a);
    }
  }

  error(a: any) {
    for (const observer of this.observers) {
      observer.error(a);
    }
  }

  complete() {
    for (const observer of this.observers) {
      observer.complete();
    }
  }
}
