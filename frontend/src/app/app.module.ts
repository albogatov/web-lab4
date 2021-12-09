import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NotFoundComponent} from "./error/not-found.component";
import {LoginComponent} from "./login/login.component";
import {NotAuthorizedComponent} from "./error/error-auth/not-authorized.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ResultService} from "./services/result.service";
import {AuthService} from "./services/auth.service";
import {TokenInterceptor} from "./interceptors/token.interceptor";
import {AppRoutingModule} from "./app-routing.module";
import {InputComponent} from "./main/input/input.component";
import {MainComponent} from "./main/main/main.component";
import {ResultsComponent} from "./main/results/results.component";

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoginComponent,
    NotAuthorizedComponent,
    InputComponent,
    MainComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    ResultService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
