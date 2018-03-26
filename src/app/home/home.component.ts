import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private location: Location ) { }
  public pass: number = 0;

  ngOnInit() {
    if (this.pass === 4) {
      console.log(this.pass);
      window.location.reload();
    } else {
      console.log(this.pass);
      this.pass++;
    }
  }

}
