import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Socket } from './ws';

@Injectable()
export class WsService {
  constructor( private http: HttpClient ) { }
  private socket: Socket;
  observer: Observer<string>;

  getStatus(): Observable<string> {
    console.log('GET');
    this.socket = socketIo('http://10.1.1.144:5000');
    this.socket.on('clientdata', (res) => {
      this.observer.next(res.data);
    });
    this.socket.on('receipt', (res) => {
      this.observer.next(res.data);
    });
    this.socket.on('CB', (res) => {
      this.observer.next(res.data);
    });
    return this.createObservable();
  }
  createObservable(): Observable<string> {
    return new Observable<string>(observer => {
      this.observer = observer;
    });
  }
  private handleError(error) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }
}
