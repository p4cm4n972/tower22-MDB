import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as socketIo from 'socket.io-client';
import { Socket } from './ws';

@Injectable()
export class RestService {

  constructor(private http: HttpClient) { }
  private socket: Socket;
  public uri = 'http://10.1.1.128:9010/ws/payment';

  // CHECK OUT AMOUNT
  checkOut(tn, tt) {
    console.log(typeof tn, typeof tt);
    const invoice = { TransactionNumber: tn, total: tt };
    this.socket = socketIo('http://10.1.1.111:5000');
    this.socket.emit('invoice', invoice);
    return this.http
      .post(
        this.uri,
        JSON.stringify({
          AmountToPay: tt.toString(),
          TransactionNumber: tn.toString()
        })
      )
      .subscribe();
  }
  // PRINT RECEIPT
  dataticket() {
    console.log('Print Ticket');
    return this.http
      .post(
        'http://10.1.1.128:9010/ws/dataticket',
        JSON.stringify({
          'HostId': 'CIEME_01',
          'TicketType': 'AppTicket',
          'TicketURL': 'BorneProduit/Receipts/receipt.pdf'
        })
      )
      .subscribe();
  }
  // DISPENSER
  dispenser() {
    console.log('Dispenser');
    return this.http
      .post(
        'http://10.1.1.128:9010/ws/dispenser',
        JSON.stringify({
          'HostId': 'CIEME_01',
          'Cmd': 'Distribute'
        })
      )
      .subscribe();
  }
}
