import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as socketIo from 'socket.io-client';
import { Socket } from './ws';
import { Url } from '../app/app-config';
import { Location } from '@angular/common';


@Injectable()
export class RestService {
  constructor(private http: HttpClient, private location: Location) { }
  public data;
  private socket: Socket;
  // CHECK OUT AMOUNT
  checkOut(tn, tt) {
    this.socket = socketIo(Url.server);
    const invoice = { TransactionNumber: tn, total: tt };
    this.socket.emit('invoice', invoice);
    return this.http
      .post(
        Url.borneForPayment,
        JSON.stringify({
          AmountToPay: (tt * 100).toString(),
          TransactionNumber: tn.toString()
        })
      )
      .subscribe();
  }
  // PRINT CB TICKET
  checkCB() {
    return this.http.post(
      Url.borneForDataticket,
      JSON.stringify({
        'HostId': 'CIEME_01',
        'TicketType': 'CBTicket',
        'TicketURL': 'BorneProduit/DataTicket/dataticket.pdf'
      })
    )
      .subscribe();
  }
  // PRINT RECEIPT
  dataticket() {
    console.log('Print Ticket');
    return this.http
      .post(
        Url.borneForDataticket,
        JSON.stringify({
          'HostId': 'CIEME_01',
          'TicketType': 'AppTicket',
          'TicketURL': 'BorneProduit/Receipts/Receipt.pdf'
        })
      )
      .subscribe();

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
    console.log('i a dan');
    this.socket.close();
  }
}
