import {Observer} from '../interfaces/Observer';

export class Observable {

  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observer: Observer) {
    this._subscribe(observer);
  }

  private _subscribe(observer: Observer) {
  }
}
