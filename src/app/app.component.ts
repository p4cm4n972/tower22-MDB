import { Component } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  styles: ['onDisplay:onDisplay']
})
export class AppComponent {
  title = 'Tower 22 v2';
}
