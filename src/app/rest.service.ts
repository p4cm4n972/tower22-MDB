import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
// import * as socketIo from 'socket.io-client';
import { Socket } from './ws';
import { Url } from '../app/app-config';
import { Location } from '@angular/common';


@Injectable()
export class RestService {
  constructor(private http: HttpClient,private router: Router, private location: Location) {}
  public data;
  private socket: Socket;
  // CHECK OUT AMOUNT
  checkOut(tn, tt) {
    console.log(tt);
    return this.http
      .post(
        Url.masterInvoice,
        {
          AmountToPay: tt,
          TransactionNumber: tn
        }
      );
  }
  // PRINT CB TICKET
  checkCB() {
      return this.http.post(
      Url.masterDataticket,
      {
        'HostId': 'CIEME_01',
        'TicketType': 'CBTicket',
        'TicketURL': 'BorneProduit/DataTicket/dataticket.pdf'
      }
    );
  }
  // PRINT RECEIPT
  dataticket() {
    console.log('Print Ticket');
    return this.http
      .post(
        Url.masterReceipt,
        {
          'HostId': 'CIEME_01',
          'TicketType': 'AppTicket',
          'TicketURL': 'BorneProduit/Receipts/Receipt.pdf'
        }
      );
  }
  // DISPENSER
  dispenser() {
    console.log('Dispenser');
    return this.http
      .post(
        Url.masterDispenser,
      {
          'HostId': 'CIEME_01',
          'Cmd': 'Distribute'
        }
      );
  }
  // Product Mode ( in service, dep, out of service )
  /*heartbeat() {
    return this.http
      .get(
        Url.borneForHeartbeat)
      .subscribe(this.data = data => {
        console.log(data.ProductMode);
      });
  }*/
  deconnect() {
    const router = this.router;
    return this.http
    .post(
      'http://10.1.111:5000/ws/disconnect', 'disconnect'
    );
  }
}

