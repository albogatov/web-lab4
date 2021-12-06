import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from "@angular/router";
import {UserData} from "../models/user-data";
import {ResponseMessage} from "../models/response-message";

@Injectable()
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/';
  public isLoggedIn = false;
  redirectUrl: string;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  register(user: UserData) {
    return this.httpClient.post(this.apiUrl + 'register', user).pipe(tap({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.log("register error: " + error.message);
      }
    }));
    // return this.httpClient.post(this.apiUrl + 'register', user).pipe(tap((resp) => console.log(resp),
    //   error => {
    //     console.log("register error: " + error.message);
    //   }));
  }

  private getHeaders(): HttpHeaders {
    const token: string = localStorage.getItem('authToken');

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    return headers;
  }

  login(user: UserData) {
    return this.httpClient.post(this.apiUrl + 'login', user).pipe(tap({
        next: data => {
          const token = (<ResponseMessage>data).message;
          // console.log(token);
          // console.log(<ResponseMessage>data);
          localStorage.setItem('authToken', <string>token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.isLoggedIn = true;
          console.log(this.isLoggedIn);
          console.log(localStorage.getItem('authToken'));
        },
        error: error => {
          console.log("login error: " + error);
        }
      })
    );
    // return this.httpClient.post(this.apiUrl + 'login', user).pipe(tap(data => {
    //
    //     const token = (<ResponseMessage>data).message;
    //     // console.log(token);
    //     // console.log(<ResponseMessage>data);
    //     localStorage.setItem('authToken', <string>token);
    //     localStorage.setItem('currentUser', JSON.stringify(user));
    //     this.isLoggedIn = true;
    //     console.log(this.isLoggedIn);
    //     console.log(localStorage.getItem('authToken'));
    //   }, error => {
    //     console.log("login error: " + error);
    //   })
    // );
  }

  logout(user: UserData) {
    return this.httpClient.post(this.apiUrl + 'logout', user, {headers: this.getHeaders()}).subscribe({
      next: data => {
        this.isLoggedIn = false;
      },
      error: error => {
        console.log("logout error: " + error);
      }
    }).add(() => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      this.router.navigate(["/login"]);
    });
    // return this.httpClient.post(this.apiUrl + 'logout', user, {headers: this.getHeaders()}).subscribe(data => {
    //   this.isLoggedIn = false;
    // }, error => {
    //   console.log("logout error: " + error);
    // }).add(() => {
    //   localStorage.removeItem("authToken");
    //   localStorage.removeItem("currentUser");
    //   this.router.navigate(["/login"]);
    // });
  }
}

// @Injectable()
// export class AuthService {
//   private apiUrl = 'http://localhost:8080/api/';
//   public isLoggedIn = false;
//   redirectUrl: string;
//
//   constructor(private httpClient: HttpClient) {
//   }
//
//   login(data: any): Observable<any> {
//     return this.httpClient.post<any>(this.apiUrl + 'login', data).pipe(
//       tap(() => this.isLoggedIn = true)
//     );
//   }
//
//   register(data: any): Observable<any> {
//     return this.httpClient.post<any>(this.apiUrl + 'register', data);
//   }
// }
