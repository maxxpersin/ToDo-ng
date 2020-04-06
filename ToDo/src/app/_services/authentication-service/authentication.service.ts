import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../_models/user/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public route = '/api/v1'

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(loginCred: any): Observable<User> {
    return this.http.post<User>(`${this.route}/login`, { email: loginCred.email, password: loginCred.password });
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    location.reload();
    return this.http.post<any>(`${this.route}/logout`, null);
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
}
