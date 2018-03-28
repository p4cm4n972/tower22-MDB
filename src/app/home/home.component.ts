import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
// SOCKET
// import * as socketIo from 'socket.io-client';
// import { Socket } from '../ws';
import { Url } from '../../app/app-config';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private location: Location ) {
  }
  ngOnInit() {
  }
}
