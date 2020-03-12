import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDoItem } from '../../to-do-item';
import { User } from '../../_models/user/user';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  config = 'http://localhost:3000/api/v1';
  user: User;

  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) {
    this.getUser();
  }

  getAuth(): Observable<any> {
    return this.http.get<any>(`${this.config}`);
  }

  getUser() {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      //window.location.reload();
    }
    if (!this.user) {
      this.router.navigate(['/']);
    }
  }

  registerUser(newUser: any): Observable<any> {
    return this.http.post<any>(`${this.config}/register`, newUser);
  }

  logout() {
    this.user = undefined;

    localStorage.removeItem('user');

    window.location.reload();
  }

  login(info: any): Observable<any> {
    return this.http.post<any>(`${this.config}/login`, info);
  }

  getItems(uid: string): Observable<any> {
    return this.http.get<any>(`${this.config}/items/${uid}`)
  }

  createNewItem(formData: any): Observable<any> {
    return this.http.post<any>(`${this.config}/items/${this.user.id}`, formData);
  }

  getItem(iid: string): Observable<any> {
    return this.http.get<any>(`${this.config}/items/${this.user.id}/${iid}`);
  }
}
