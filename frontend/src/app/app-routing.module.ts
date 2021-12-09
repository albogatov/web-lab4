import {RouterModule, Routes} from "@angular/router";
import {NotFoundComponent} from "./error/not-found.component";
import {LoginComponent} from "./login/login.component";
import {NotAuthorizedComponent} from "./error/error-auth/not-authorized.component";
import {NgModule} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {MainComponent} from "./main/main/main.component";
import {AuthGuard} from "./auth/auth.guard";

const appRoutes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent, canActivate: [AuthGuard]},
  {path: 'unauthorized', component: NotAuthorizedComponent},
  {path: '**', component: NotFoundComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
      appRoutes, {useHash: true}
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
