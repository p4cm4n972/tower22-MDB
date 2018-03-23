import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as socketIo from 'socket.io-client';
import { Socket } from './ws';
import { Url } from '../app/app-config';
import { Location } from '@angular/common';


@Injectable()
export class RestService {
  constructor(private http: HttpClient, private location: Location) {}
  public data;
  private socket: Socket;
  // CHECK OUT AMOUNT
  checkOut(tn, tt) {
    console.log(tt);
    return this.http
      .post(
        'http://localhost:5000/api/invoice',
        {
          AmountToPay: tt,
          TransactionNumber: tn
        }
      )
      .subscribe();
  }
  // PRINT CB TICKET
  checkCB() {
    this.socket.emit('checkCB', {
    'HostId': 'CIEME_01',
    'TicketType': 'CBTicket',
    'TicketURL': 'BorneProduit/DataTicket/dataticket.pdf'
  });
    /*return this.http.post(
      Url.borneForDataticket,
      JSON.stringify({
        'HostId': 'CIEME_01',
        'TicketType': 'CBTicket',
        'TicketURL': 'BorneProduit/DataTicket/dataticket.pdf'
      })
    )
      .subscribe();*/
  }
  // PRINT RECEIPT
  dataticket() {
    console.log('Print Ticket');
    this.socket.emit('printReceipt', {
      'HostId': 'CIEME_01',
      'TicketType': 'AppTicket',
      'TicketURL': 'BorneProduit/Receipts/Receipt.pdf'
    });
    /*return this.http
      .post(
        Url.borneForDataticket,
        JSON.stringify({
          'HostId': 'CIEME_01',
          'TicketType': 'AppTicket',
          'TicketURL': 'BorneProduit/Receipts/Receipt.pdf'
        })
      )
      .subscribe();*/

  }
  // DISPENSER
  dispenser() {
    console.log('Dispenser');
    return this.http
      .post(
        Url.borneForDispenser,
        JSON.stringify({
          'HostId': 'CIEME_01',
          'Cmd': 'Distribute'
        })
      )
      .subscribe();
  }
  // Product Mode ( in service, dep, out of service )
  heartbeat() {
    return this.http
      .get(
        Url.borneForHeartbeat)
      .subscribe(this.data = data => {
        console.log(data.ProductMode);
      });
  }
  deconnect() {
    this.socket = socketIo(Url.server);
    console.log('i a dan');
    this.socket.emit('disconnect', 'disconnect');
  }
}
