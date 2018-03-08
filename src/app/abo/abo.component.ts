import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ABOS } from '../abo/mock-abo';
import { Abo } from '../abo/abo';
// SERVICE
import { RestService } from '../rest.service';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { WsService } from '../ws.service';


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
  @ViewChild('style') public contentModal;
  @ViewChild('CB') public CBModal;
  @ViewChild('dispenser') public dispenserModal;
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
    this.toast.info('Merci de récuperer vos ticket', 'MERCI ET A BIENTOT', options);
  }
  add(abo): void {
    switch (abo) {
      // ADULTE
      case 'adulte':
        this.abos[0].qty++;
        ++this.abo;
        this.total =
          +this.abos[0].qty * 100 +
          +this.abos[1].qty * 70 +
          +this.abos[2].qty * 50;
        break;
      // ENFANT
      case 'enfant':
        this.abos[1].qty++;
        ++this.abo;
        this.total =
          +this.abos[0].qty * 100 +
          +this.abos[1].qty * 70 +
          +this.abos[2].qty * 50;
        break;
      // GROUPE
      case 'groupe':
        this.abos[2].qty++;
        ++this.abo;
        this.total =
          +this.abos[0].qty * 100 +
          +this.abos[1].qty * 70 +
          +this.abos[2].qty * 50;
        break;
    }
  }
  // REMOVE ARTICLE
  less(items) {
    switch (items) {
      case 'adulte':
        this.abo = this.abo - 1;
        this.total = this.total - 100;
        this.abos[0].qty = this.abos[0].qty - 1;
        break;
      case 'enfant':
        this.abo = this.abo - 1;
        this.total = this.total - 70;
        this.abos[1].qty = this.abos[1].qty - 1;
        break;
      case 'groupe':
        this.abo = this.abo - 1;
        this.total = this.total - 50;
        this.abos[2].qty = this.abos[2].qty - 1;
        break;
    }
  }
  // ADD ARTICLE
  more(items) {
    switch (items) {
      case 'adulte':
        this.abo = this.abo + 1;
        this.total = this.total + 100;
        this.abos[0].qty = this.abos[0].qty + 1;
        break;
      case 'enfant':
        this.abo = this.abo + 1;
        this.total = this.total + 70;
        this.abos[1].qty = this.abos[1].qty + 1;
        break;
      case 'groupe':
        this.abo = this.abo + 1;
        this.total = this.total + 50;
        this.abos[2].qty = this.abos[2].qty + 1;
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
  ngOnInit() {
  }
  onBack(): void {
    this.location.back();
  }
}
