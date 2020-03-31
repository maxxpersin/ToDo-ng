import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToDoItem } from '../../to-do-item';
import { User } from '../../_models/user/user';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  config = 'api/v1';
  user: BehaviorSubject<User>;

  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) {
    this.user = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
  }

  getAuth(): Observable<any> {
    return this.http.get<any>(`${this.config}`);
  }

  getUser() {
    return this.user.value;
  }

  registerUser(newUser: any): Observable<any> {
    return this.http.post<any>(`${this.config}/register`, newUser);
  }

  logout() {
    this.user.next(null);

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
    return this.http.post<any>(`${this.config}/items/${this.getUser().id}`, formData);
  }

  getItem(iid: string): Observable<any> {
    return this.http.get<any>(`${this.config}/items/${this.getUser().id}/${iid}`);
  }
}
