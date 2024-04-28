import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './pages/dashboard/sidebar/sidebar.component';
import { VaccineDetailsComponent } from './pages/dashboard/vaccine-details/vaccine-details.component';
import { SearchBarComponent } from './pages/dashboard/vaccine-details/search-bar/search-bar.component';
import { SearchResultsComponent } from './pages/dashboard/vaccine-details/search-results/search-results.component';
import { FormsModule } from '@angular/forms';
import { AddVaccineComponent } from './pages/dashboard/add-vaccine/add-vaccine.component';
import { RequestsComponent } from './pages/dashboard/requests/requests.component';
import { RegisterViolationComponent } from './pages/dashboard/register-violation/register-violation.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserConfigComponent } from './config/browser-config/browser-config.component';
import { NotifierModule } from 'angular-notifier';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    SidebarComponent,
    VaccineDetailsComponent,
    SearchBarComponent,
    SearchResultsComponent,
    AddVaccineComponent,
    RequestsComponent,
    RegisterViolationComponent,
    BrowserConfigComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NotifierModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
