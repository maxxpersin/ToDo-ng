import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToDoItem } from '../../_models/to-do-item/to-do-item';
import { User } from '../../_models/user/user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication-service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  config = 'api/v1';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService, private router: Router, private activatedRoute: ActivatedRoute) { }

  getAuth(): Observable<any> {
    return this.http.get<any>(`${this.config}`);
  }

  registerUser(newUser: any): Observable<any> {
    return this.http.post<any>(`${this.config}/register`, newUser);
  }

  createNewGroup(uid: string, formData: any) {
    console.log(formData);
    return this.http.post<any>(`${this.config}/groups/${uid}`, formData);
  }

  getGroups(uid: string): Observable<any> {
    return this.http.get<any>(`${this.config}/groups/${uid}`);
  }

  getItems(uid: string, group: string, options: any): Observable<any> {
    return this.http.get<any>(`${this.config}/items/${uid}?group=${group}&order=${options || 'default'}`);
  }

  createNewItem(formData: any): Observable<any> {
    return this.http.post<any>(`${this.config}/items/${this.authenticationService.currentUserValue.id}`, formData);
  }

  getItem(iid: string): Observable<any> {
    return this.http.get<any>(`${this.config}/items/${this.authenticationService.currentUserValue.id}/${iid}`);
  }

  deleteItem(iid: string): Observable<any> {
    return this.http.delete<any>(`${this.config}/items/${this.authenticationService.currentUserValue.id}/${iid}`);
  }
}
