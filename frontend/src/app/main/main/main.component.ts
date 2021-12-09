import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserData} from "../../models/user-data";
import {AuthGuard} from "../../auth/auth.guard";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'main-section',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  currentUser: UserData;


  constructor(private authGuard: AuthGuard, private authService: AuthService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  logOut() {
    this.authService.logout(this.currentUser);
  }
}
