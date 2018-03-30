import { Component } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  styles: ['onDisplay:onDisplay']
})
export class AppComponent {
  constructor() {
   const socket = socketIo('http://10.1.1.103:5000');
  }
  title = 'Tower 22 v2';
}
