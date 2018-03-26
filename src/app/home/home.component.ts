import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private location: Location ) {
  }
  count: number = 0;
  ngOnInit() {
    
   }
   load() {
     window.location.reload();
   }
   pass() {
     this.count++;
     console.log('PASS :' + this.count);
   }
}
