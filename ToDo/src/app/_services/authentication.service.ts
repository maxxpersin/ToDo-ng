import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  private currentUser: Observable<User>;
  public route = '/api/v1'

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(loginCred: any) {
    let error = this.http.post<User>(`${this.route}/login`, { email: loginCred.email, password: loginCred.password })
      .subscribe(
        data => {
          this.currentUserSubject.next(data);
          localStorage.setItem('user', JSON.stringify(data));
          this.router.navigate(['']);
        },
        error => {
          return error;
        }
      );

    return error;
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
