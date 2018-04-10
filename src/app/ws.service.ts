import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as socketIo from 'socket.io-client';
import { Socket } from './ws';
import { Url } from '../app/app-config';


@Injectable()
export class WsService {
  constructor( private http: HttpClient ) { }
  private socket: Socket;
  observer: Observer<string>;

  getStatus(): Observable<string> {
    this.socket = socketIo(Url.master);
    this.socket.on('clientdata', (res) => {
    this.observer.next(res.data);
    });
    this.socket.on('receipt', (res) => {
      this.observer.next(res.data);
    });
    this.socket.on('CB', (res) => {
      this.observer.next(res.data);
    });
    this.socket.on('incident', (res) => {
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
