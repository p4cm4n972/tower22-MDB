import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';
// TICKETS
import { TICKETS } from '../tickets/mock-ticket';
import { Ticket } from '../tickets/ticket';
// ABONNEMENT
import { ABOS } from '../abo/mock-abo';
import { Abo } from '../abo/abo';
// SERVICE
import { RestService } from '../rest.service';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { RouterModule, Router } from '@angular/router';
import { WsService } from '../ws.service';
// SOCKET
import * as socketIo from 'socket.io-client';
import { Socket } from '../ws';
import { Url } from '../../app/app-config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private location: Location, public rest: RestService, private toast: ToastService, private ws: WsService) {
  }
  public total: number = 0;
  public trackerIncident: number = 0;
  private socket: Socket;
  public data;
  public sub: Subscription;
  // 
  public cart: number = 0;
  public inChart: boolean = true;
  public tickets = TICKETS;
  //
  public abo: number = 0;
  public abos = ABOS;
  public aboTransaction = 0;
  //
  public modal = 1;
  //
  public  nothing;
  // PASS
  @ViewChild('ticketsModal') public ticketsModal;
  @ViewChild('abosModal') public abosModal;

  @ViewChild('style') public contentModal;
  @ViewChild('CB') public CBModal;
  @ViewChild('dispenser') public dispenserModal;
  @ViewChild('back') public backModal;
  @ViewChild('incident') public incidentModal;
  //


  // ALERT: PAIEMENT ACCEPTE
  paiementSuccess() {
    const options = { positionClass: 'toast-top-center', progressBar: true, timeOut: 5000, toastClass: 'toasty' };
    this.toast.success('Impression ticket CB encours', 'PAIEMENT ACCEPTE', options);
  }
  // ALERT: IMPRESSION TICKET CB
  receiptInfo() {
    const options = { positionClass: 'toast-top-center', progressBar: true, toastClass: 'toasty' };
    this.toast.info('Impression reçu encours', 'Reçu', options);
  }
  // ALERT: IMPRESSION RECU
  receiptSuccess() {
    const options = { positionClass: 'toast-top-center', progressBar: true, toastClass: 'toasty' };
    this.toast.success('Merci de récuperer vos tickets', 'MERCI ET A BIENTOT', options);
  }
  // ALERT: INCIDENT PAIEMENT
  incident() {
    const options = { positionClass: 'toast-top-center', progressBar: true, toastClass: 'toasty' };
    this.toast.error('INCIDENT PAIEMENT', 'TRANSACTION ANNULÉE', options);
  }

  //
  ticket() {
    this.ticketsModal.show();
    this.modal = 0;
    this.nothing = setTimeout(() => {
      this.onBackValid();
    }, 20000);
  }
  abonnement() {
    this.abosModal.show();
    this.modal = 0;
    this.aboTransaction = 1;
  }
  // AJOUT tickets
  addTickets(ticket): void {
    clearTimeout(this.nothing);
    switch (ticket) {
      // ADULTE
      case 'adulte':
        this.tickets[0].qty++;
        ++this.cart;
        this.total =
          +this.tickets[0].qty * 1 +
          +this.tickets[1].qty * 1 +
          +this.tickets[2].qty * 1;
        break;
      // ENFANT
      case 'enfant':
        this.tickets[1].qty++;
        ++this.cart;
        this.total =
          +this.tickets[0].qty * 1 +
          +this.tickets[1].qty * 1 +
          +this.tickets[2].qty * 1;
        break;
      // GROUPE
      case 'groupe':
        this.tickets[2].qty++;
        ++this.cart;
        this.total =
          +this.tickets[0].qty * 1 +
          +this.tickets[1].qty * 1 +
          +this.tickets[2].qty * 1;
        break;
    }
  }
  // REMOVE ARTICLE
  lessTickets(items) {
    switch (items) {
      case 'adulte':
        this.cart = this.cart - 1;
        this.total = this.total - 1;
        this.tickets[0].qty = this.tickets[0].qty - 1;
        break;
      case 'enfant':
        this.cart = this.cart - 1;
        this.total = this.total - 1;
        this.tickets[1].qty = this.tickets[1].qty - 1;
        break;
      case 'groupe':
        this.cart = this.cart - 1;
        this.total = this.total - 1;
        this.tickets[2].qty = this.tickets[2].qty - 1;
        break;
    }
  }
  // ADD ARTICLE
  moreTickets(items) {
    switch (items) {
      case 'adulte':
        this.cart = this.cart + 1;
        this.total = this.total + 1;
        this.tickets[0].qty = this.tickets[0].qty + 1;
        break;
      case 'enfant':
        this.cart = this.cart + 1;
        this.total = this.total + 1;
        this.tickets[1].qty = this.tickets[1].qty + 1;
        break;
      case 'groupe':
        this.cart = this.cart + 1;
        this.total = this.total + 1;
        this.tickets[2].qty = this.tickets[2].qty + 1;
        break;
    }
  }
  // DEBUT TRANSACTION ENVOIE INFOS (n° transaction, montant total)
  payer(total) {
    this.contentModal.hide();
    this.incidentModal.hide();
    this.CBModal.show();
    const TransactionNumber = Math.floor(Math.random() * 99999999999 + 1);
    this.rest.checkOut(TransactionNumber.toString(), (this.total * 100).toString()).subscribe((data) => {
      console.log(data);
    });
  }
  // WEB SOCKET EVENT LISTENER STATUS
  status(data) {
    switch (data) {
      case 'CB':
        this.CBModal.hide();
        this.paiementSuccess();
        this.trackerIncident = 1;
        // RESET PANIER
        for (let i = 0; i < this.tickets.length; i++) {
          this.tickets[i].qty = 0;
          this.total = 0;
          this.cart = 0;
        }
        for (let i = 0; i < this.abos.length; i++) {
          this.abos[i].qty = 0;
          this.total = 0;
          this.abo = 0;
        }
        break;
      case 'Print CB OK':
        if (this.trackerIncident === 0) {
          this.incident();
          for (let i = 0; i < this.tickets.length; i++) {
            this.tickets[i].qty = 0;
            this.total = 0;
            this.cart = 0;
          }
          for (let i = 0; i < this.abos.length; i++) {
            this.abos[i].qty = 0;
            this.total = 0;
            this.abo = 0;
          }
        } else {
          this.receiptInfo();
          setTimeout(() => {
            this.rest.dataticket().subscribe((done) => {
              console.log(done);
            });
          }, 5000);
        }
        break;
      case 'Print DATA OK':
        console.log(this.aboTransaction);
        this.receiptSuccess();
        if (this.aboTransaction === 0) {
          this.onBack();
        } else {
          this.rest.dispenser().subscribe((done) => {
            console.log(done);
          });
        }
        break;
      case 'Dispenser OK':
        this.dispenserModal.show();
        this.aboTransaction = 0;
        setTimeout(() => {
          this.dispenserModal.hide();
        }, 5000);
        this.onBack();
        break;
      case 'incident':
        this.trackerIncident = 0;
        this.CBModal.hide();
        this.contentModal.hide();
        this.onBackValid();
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

  // CONDITION RETOUR MENU
  onBack(): void {
    if (this.total === 0) {
      this.modal = 1;
      this.ticketsModal.hide();
      this.abosModal.hide();
    } else {
      this.backModal.show();
    }
  }
  // RETOUR MENU
  onBackValid(): void {
    for (let i = 0; i < this.tickets.length; i++) {
      this.tickets[i].qty = 0;
      this.total = 0;
      this.cart = 0;
    }
    for (let i = 0; i < this.abos.length; i++) {
      this.abos[i].qty = 0;
      this.total = 0;
      this.abo = 0;
    }
    this.backModal.hide();
    this.onBack();

  }

  add(abo): void {
    switch (abo) {
      // ADULTE
      case 'adulte':
        this.abos[0].qty++;
        ++this.abo;
        this.total =
          +this.abos[0].qty * 10 +
          +this.abos[1].qty * 7 +
          +this.abos[2].qty * 5;
        break;
      // ENFANT
      case 'enfant':
        this.abos[1].qty++;
        ++this.abo;
        this.total =
          +this.abos[0].qty * 10 +
          +this.abos[1].qty * 7 +
          +this.abos[2].qty * 5;
        break;
      // GROUPE
      case 'groupe':
        this.abos[2].qty++;
        ++this.abo;
        this.total =
          +this.abos[0].qty * 1 +
          +this.abos[1].qty * 7 +
          +this.abos[2].qty * 5;
        break;
    }
  }
  // REMOVE ARTICLsocketIoE
  less(items) {
    switch (items) {
      case 'adulte':
        this.abo = this.abo - 1;
        this.total = this.total - 10;
        this.abos[0].qty = this.abos[0].qty - 1;
        break;
      case 'enfant':
        this.abo = this.abo - 1;
        this.total = this.total - 7;
        this.abos[1].qty = this.abos[1].qty - 1;
        break;
      case 'groupe':
        this.abo = this.abo - 1;
        this.total = this.total - 5;
        this.abos[2].qty = this.abos[2].qty - 1;
        break;
    }
  }
  // ADD ARTICLE
  more(items) {
    switch (items) {
      case 'adulte':
        this.abo = this.abo + 1;
        this.total = this.total + 10;
        this.abos[0].qty = this.abos[0].qty + 1;
        break;
      case 'enfant':
        this.abo = this.abo + 1;
        this.total = this.total + 7;
        this.abos[1].qty = this.abos[1].qty + 1;
        break;
      case 'groupe':
        this.abo = this.abo + 1;
        this.total = this.total + 5;
        this.abos[2].qty = this.abos[2].qty + 1;
        break;
    }
  }
  // SOCKET EMIT STATUS
  statusAbo(data) {
    switch (data) {
      case 'CB':
        this.CBModal.hide();
        this.paiementSuccess();
        this.trackerIncident = 1;
        // RESET PANIER
        for (let i = 0; i < this.abos.length; i++) {
          this.abos[i].qty = 0;
          this.total = 0;
          this.abo = 0;
        }
        break;
      case 'Print CB OK':
        if (this.trackerIncident === 0) {
          this.incident();
          for (let i = 0; i < this.abos.length; i++) {
            this.abos[i].qty = 0;
            this.total = 0;
            this.abo = 0;
          }
        } else {
          this.rest.dataticket().subscribe((done) => {
            console.log(done);
          });
          this.receiptInfo();
        }
        break;
      case 'Print DATA OK':
        this.receiptSuccess();
        this.rest.dispenser().subscribe((done) => {
          console.log(done);
        });
        break;
      case 'Dispenser OK':
        this.dispenserModal.show();
        break;
      case 'incident':
        this.trackerIncident = 0;
        this.CBModal.hide();
        this.contentModal.hide();
        this.incident();
        this.rest.deconnect().subscribe((done) => {
          console.log(done);
        });
        break;
    }
  }
}
