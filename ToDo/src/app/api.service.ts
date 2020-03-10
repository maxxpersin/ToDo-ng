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
    return this.http.get<any>(`${this.config}`);
  }

  getItems(uid: string): Observable<any> {
    return this.http.get<any>(`${this.config}/items/${uid}`)
  }

  createNewItem(uid: string, formData: any): Observable<any> {
    return this.http.post<any>(`${this.config}/items/${uid}`, formData);
  }
}
