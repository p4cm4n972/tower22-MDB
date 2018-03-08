import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// MATERIAL DESIGN BOOTSTRAP
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModules } from 'ng-mdb-pro';
import { MDBSpinningPreloader } from 'ng-mdb-pro';
import { ToastModule } from 'ng-mdb-pro/pro/alerts';
// ROUTER
import { RouterModule, Routes } from '@angular/router';

// SERVICE
import { RestService } from '../app/rest.service';
import { WsService } from '../app/ws.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TicketsComponent } from './tickets/tickets.component';
import { AboComponent } from './abo/abo.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'abo', component: AboComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TicketsComponent,
    AboComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    MDBBootstrapModules.forRoot(),
    ToastModule.forRoot(),
    BrowserModule,
    HttpClientModule
  ],
  providers: [MDBSpinningPreloader, RestService, WsService ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
