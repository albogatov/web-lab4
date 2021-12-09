import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: string;
  pwd: string;
  success = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  logIn(loginForm) {
    if (loginForm.valid) {
      this.authService.login({login: this.login, password: this.pwd})
        .subscribe(resp => this.router.navigate(['/main']),
          (error: HttpErrorResponse) => {
          let br = document.createElement('br');
            console.log(error.error);
            document.getElementById('error').textContent = error.error.message;
            document.getElementById('error').appendChild(br);
          });
    }
  }

  register(loginForm) {
    if (loginForm.valid) {
      this.authService.register({login: this.login, password: this.pwd})
        .subscribe(data => {
          this.authService.login({login: this.login, password: this.pwd})
            .subscribe(resp => this.router.navigate(['/main']),
              (error: HttpErrorResponse) => {
                let br = document.createElement('br');
                console.log(error.error);
                document.getElementById('error').textContent = error.error.message;
                document.getElementById('error').appendChild(br);
              });
        }, (error: HttpErrorResponse) => {
          let br = document.createElement('br');
          console.log(error.error);
          document.getElementById('error').textContent = error.error.message;
          document.getElementById('error').appendChild(br);
        });
    }
  }
}
