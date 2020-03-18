import {Component} from '@angular/core';
import {Observable} from './rx/Observable';
import {Observer} from './interfaces/Observer';
import {Subscribe} from './rx/Subscribe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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

    const bodyEl: Element = document.querySelector('body');

    this.fromEvent('click', bodyEl).subscribe({
      next: (value) => {
        console.log('next', value);
      },
      error(e: any): void {
        console.log('error');
      },
      complete(): void {
        console.log('complete');
      }
    });
  }

  timeOut(time) {
    return new Observable((observer: Observer): Subscribe => {
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
    return new Observable((observer: Observer): Subscribe => {
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
