import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Result} from "../models/result";
import {InputComponent} from "../main/input/input.component";

@Injectable()
export class ResultService {
  private apiUrl = 'http://localhost:8080/api/';
  public results: BehaviorSubject<Result[]> = new BehaviorSubject<Result[]>([]);
  public component: InputComponent;

  constructor(private http: HttpClient) {

  }

  private getHeaders(): HttpHeaders {
    const token: string = localStorage.getItem('authToken');

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    return headers;
  }

  getAllResults() {
    return this.http.get<Result[]>(this.apiUrl + 'results/get', {headers: this.getHeaders()}).subscribe({
      next: data => this.results.next(data as Result[]),
      error: error => console.error('Observer got an error: ' + error),
      complete: () => this.component.drawAllResults(),
    });
    // return this.http.get<Result[]>(this.apiUrl + 'results/get', {headers: this.getHeaders()}).subscribe((data) => {
    //   this.results.next(data as Result[]);
    //   console.log("result got");
    // });
  }

  saveResult(result: Result) {
    console.log("saving");
    return this.http.post<Result>(this.apiUrl + 'results/save', result, {headers: this.getHeaders()}).toPromise();
  }

  clearResults() {
    console.log("clear");
    return this.http.delete(this.apiUrl + 'results/clear', {headers: this.getHeaders()}).subscribe((result) => {
      this.getAllResults();
    });
  }
}
