import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  config = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) { }

  getAuth(): Observable<any> {
    return this.http.get<any>(`${this.config}`, {withCredentials: true});
  }
}
