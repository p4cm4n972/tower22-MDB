import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ABOS } from '../abo/mock-abo';
import { Abo } from '../abo/abo';
// SERVICE
import { RestService } from '../rest.service';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { WsService } from '../ws.service';
// SOCKET IO
import * as socketIo from 'socket.io-client';
import { Socket } from '../ws';
import { Url } from '../../app/app-config';

@Component({
  selector: 'app-abo',
  templateUrl: './abo.component.html',
  styleUrls: ['./abo.component.scss']
})
export class AboComponent implements OnInit {

  constructor(private location: Location, public rest: RestService, private toast: ToastService, private ws: WsService) { }
  public abo: number = 0;
  public total: number = 0;
  public abos = ABOS;
  public sub: Subscription;
  public data;
  private socket: Socket;
  public trackerIncident: number = 0;

  @ViewChild('style') public contentModal;
  @ViewChild('CB') public CBModal;
  @ViewChild('dispenser') public dispenserModal;
  @ViewChild('back') public backModal;
  // ALERT PAIEMENT ACCEPTE
  paiementSuccess() {
    const options = { positionClass: 'toast-top-center', progressBar: true, toastClass: 'toasty' };
    this.toast.success('Impression ticket CB encours', 'PAIEMENT ACCEPTE', options);
  }
  // ALERT IMPRESSION TICKET CB
  receiptInfo() {
    const options = { positionClass: 'toast-top-center', progressBar: true, toastClass: 'toasty' };
    this.toast.info('Impression reçu encours', 'Reçu', options);
  }
  // ALERT IMPRESSION RECU
  receiptSuccess() {
    const options = { positionClass: 'toast-top-center', progressBar: true, toastClass: 'toasty' };
    this.toast.info('Merci de récuperer vos ticket', 'MERCI ET A BIENTOT', options);
  }
  // ALERT: INCIDENT PAIEMENT
  incident() {
    const options = { positionClass: 'toast-top-center', progressBar: true, toastClass: 'toasty' };
    this.toast.error('INCIDENT PAIEMENT, TRANSACTION ANNULÉE', options);
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
  // REMOVE ARTICLE
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
  // DEBUT TRANSACTION ENVOIE INFOS
  payer(total) {
    console.log(this.total);
    this.contentModal.hide();
    this.CBModal.show();
    const TransactionNumber = Math.floor(Math.random() * 99999999999 + 1);
    this.rest.checkOut(TransactionNumber, this.total);
  }
  // SOCKET EMIT STATUS
  status(data) {
    switch (data) {
      case 'CB':
        this.CBModal.hide();
        this.paiementSuccess();
        // RESET PANIER
        for (let i = 0; i < this.abos.length; i++) {
          this.abos[i].qty = 0;
          this.total = 0;
          this.abo = 0;
        }
        break;
      case 'Print CB OK':
        if (this.trackerIncident === 1) {
          this.incident();
          this.location.back();
        } else {
          this.rest.dataticket();
          this.receiptInfo();
        }
        break;
      case 'Print DATA OK':
        this.receiptSuccess();
        this.rest.dispenser();
        break;
      case 'Dispenser OK':
        this.dispenserModal.show();
        const location = this.location;
        const rest = this.rest;
        setTimeout(function () {
          delete this.socket;
          location.back();
        }, 5000);
        this.rest.heartbeat();
        break;
      case 'incident':
        this.trackerIncident++;
        this.CBModal.hide();
        this.contentModal.hide();
        this.incident();
        this.location.back();
        break;
    }
  }
  ngOnInit() {
    this.sub = this.ws.getStatus().subscribe(data => {
      this.data = data;
      console.log(data);
      this.status(data);
    });
    this.trackerIncident = 0;
    
  }
  // CONDITION RETOUR MENU
  onBack(): void {
    if (this.total === 0) {
      this.location.back();
    } else {
      this.backModal.show();
    }
  }
  // RETOUR MENU
  onBackValid(): void {
    for (let i = 0; i < this.abos.length; i++) {
      this.abos[i].qty = 0;
      this.total = 0;
      this.abo = 0;
    }
    this.location.back();
  }
}
