import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private location: Location, private zone: NgZone) { }

  ngOnInit() {
    const reloadPage = function () {
      this.zone.runOutsideAngular(() =>
    location.reload());
    };
  }

}
