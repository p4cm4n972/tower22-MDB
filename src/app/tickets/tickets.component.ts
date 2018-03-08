import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { TICKETS } from '../tickets/mock-ticket';
import { Ticket } from '../tickets/ticket';
// SERVICE
import { RestService } from '../rest.service';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { WsService } from '../ws.service';
// MATERIAL DESIGN BOOTSTRAP

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})

export class TicketsComponent implements OnInit {

  constructor(private location: Location, public rest: RestService, private toast: ToastService, private ws: WsService) {
  }
  public cart: number = 0;
  public total: number = 0;
  public inChart: boolean = true;
  public tickets = TICKETS;
  public sub: Subscription;
  public data;
  @ViewChild('style') public contentModal;
  @ViewChild('CB') public CBModal;
  @ViewChild('dispenser') public dispenserModal;
  @ViewChild('back') public backModal;
  // ALERT PAIEMENT ACCEPTE
  paiementSuccess() {
    const options = { positionClass: 'toast-top-center', progressBar: true, };
    this.toast.success('Impression ticket CB encours', 'PAIEMENT ACCEPTE', options);
  }
  // ALERT IMPRESSION TICKET CB
  receiptInfo() {
    const options = { positionClass: 'toast-top-center', progressBar: true, };
    this.toast.info('Impression reçu encours', 'Reçu', options);
  }
  // ALERT IMPRESSION RECU
  receiptSuccess() {
    const options = { positionClass: 'toast-top-center', progressBar: true, };
    this.toast.info('Merci de récuperer vos tickets', 'MERCI ET A BIENTOT', options);
  }
  // AJOUT tickets
  add(ticket): void {
    switch (ticket) {
      // ADULTE
      case 'adulte':
        this.tickets[0].qty++;
        ++this.cart;
        this.total =
          +this.tickets[0].qty * 10 +
          +this.tickets[1].qty * 7 +
          +this.tickets[2].qty * 5;
        break;
      // ENFANT
      case 'enfant':
        this.tickets[1].qty++;
        ++this.cart;
        this.total =
          +this.tickets[0].qty * 10 +
          +this.tickets[1].qty * 7 +
          +this.tickets[2].qty * 5;
        break;
      // GROUPE
      case 'groupe':
        this.tickets[2].qty++;
        ++this.cart;
        this.total =
          +this.tickets[0].qty * 10 +
          +this.tickets[1].qty * 7 +
          +this.tickets[2].qty * 5;
        break;
    }
  }
  // REMOVE ARTICLE
  less(items) {
    switch (items) {
      case 'adulte':
        this.cart = this.cart - 1;
        this.total = this.total - 10;
        this.tickets[0].qty = this.tickets[0].qty - 1;
        break;
      case 'enfant':
        this.cart = this.cart - 1;
        this.total = this.total - 7;
        this.tickets[1].qty = this.tickets[1].qty - 1;
        break;
      case 'groupe':
        this.cart = this.cart - 1;
        this.total = this.total - 5;
        this.tickets[2].qty = this.tickets[2].qty - 1;
        break;
    }
  }
  // ADD ARTICLE
  more(items) {
    switch (items) {
      case 'adulte':
        this.cart = this.cart + 1;
        this.total = this.total + 10;
        this.tickets[0].qty = this.tickets[0].qty + 1;
        break;
      case 'enfant':
        this.cart = this.cart + 1;
        this.total = this.total + 7;
        this.tickets[1].qty = this.tickets[1].qty + 1;
        break;
      case 'groupe':
        this.cart = this.cart + 1;
        this.total = this.total + 5;
        this.tickets[2].qty = this.tickets[2].qty + 1;
        break;
    }
  }
  //
  payer(total) {
    console.log(this.total);
    this.contentModal.hide();
    this.CBModal.show();
    const TransactionNumber = Math.floor(Math.random() * 99999999999 + 1);
    this.rest.checkOut(TransactionNumber, this.total);
  }

  status(data) {
    switch (data) {
      case 'CB':
        this.CBModal.hide();
        this.paiementSuccess();
        // RESET PANIER
        for (let i = 0; i < this.tickets.length; i++) {
          this.tickets[i].qty = 0;
          this.total = 0;
          this.cart = 0;
        }
        break;
      case 'Print CB OK':
        this.rest.dataticket();
        this.receiptInfo();
        break;
      case 'Print DATA OK':
        this.receiptSuccess();
        break;
      case 'Dispenser OK':
        this.dispenserModal.show();
        break;


    }
  }

  ngOnInit() {
    this.sub = this.ws.getStatus().subscribe(data => {
      this.data = data;
      console.log(data);
      this.status(data);
    });
  }
  onBack(): void {
    if (this.total === 0) {
      this.location.back();
    } else {
      this.backModal.show();
    }
  }
  onBackValid(): void {
    for (let i = 0; i < this.tickets.length; i++) {
      this.tickets[i].qty = 0;
      this.total = 0;
      this.cart = 0;
    }
    this.location.back();
  }
}
