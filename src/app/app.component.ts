import { Component, OnInit } from '@angular/core';
import { Observable } from './rx/Observable';
import { Observer } from './rx/Observer';
import { Subscription } from './rx/Subscription.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Advanced-Asynchronous-JavaScript';

  constructor() {
    // const subscription = this.timeOut(500).subscribe({
    //   next: (value) => {
    //     console.log('next - value', value);
    //   },
    //   error(e: any): void {
    //     console.log('error');
    //   },
    //   complete(): void {
    //     console.log('complete');
    //   }
    // });

    // const bodyEl: Element = document.querySelector('body');
    //
    // this.fromEvent('click', bodyEl).subscribe({
    //   next: (value) => {
    //     console.log('next', value);
    //   },
    //   error(e: any): void {
    //     console.log('error');
    //   },
    //   complete(): void {
    //     console.log('complete');
    //   }
    // });
  }

  ngOnInit(): void {
    // const fromEventSubscribe = this.fromEvent('click', document.getElementById('button'))
    //   .map((event: Event) => {
    //     return event.target;
    //   })
    //   .subscribe({
    //     next: (eventTarget) => {
    //       console.log('next', eventTarget);
    //     },
    //     error(e: any): void {
    //       console.log('error');
    //     },
    //     complete(): void {
    //       console.log('complete');
    //     }
    //   });

    // const fromEventSubscribe = this.fromEvent('click', document.querySelector('body'))
    //   .map((event: any) => {
    //     return event.clientX;
    //   })
    //   .filter((clientX: number) => {
    //     return clientX > 50;
    //   })
    //   .subscribe({
    //     next: (eventTarget) => {
    //       console.log('next', eventTarget);
    //     },
    //     error(e: any): void {
    //       console.log('error');
    //     },
    //     complete(): void {
    //       console.log('complete');
    //     }
    //   });
    //
    // Observable.zip(
    //   of(1),
    //   of(2),
    //   of(3)
    // ).subscribe({
    //   next(value: any): void {
    //     console.log('zip', value);
    //   },
    //   error(error: any): void {
    //   },
    //   complete(): void {
    //   }
    // });

    // Observable.concat(
    //   of(1, 2, 3),
    //   of(4, 5, 6),
    //   of(7, 8, 9)
    // ).subscribe({
    //   next(value: any): void {
    //     console.log('concat', value);
    //   },
    //   error(error: any): void {
    //   },
    //   complete(): void {
    //   }
    // });

    Observable
      .of(5)
      .observeOn(action => setTimeout(action, 5000))
      .subscribe({
        next(value: any): void {
          console.log('of+observeOn - value', value);
        },
        error(error: any): void {
        },
        complete(): void {
        }
      });
  }

  timeOut(time) {
    return new Observable((observer: Observer): Subscription => {
      const handle = setTimeout(() => {
        observer.next(null);
        observer.complete();
      }, time);

      return {
        unsubscribe: () => clearTimeout(handle)
      };
    });
  }

  fromEvent(eventName: string, element: Element): Observable {
    return new Observable((observer: Observer): Subscription => {
      const handler = (event) => {
        observer.next(event);
      };

      element.addEventListener(eventName, handler);

      return {
        unsubscribe: () => {
          element.removeEventListener(eventName, handler);
        }
      };
    });
  }
}
