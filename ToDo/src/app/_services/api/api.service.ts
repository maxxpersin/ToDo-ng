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
    return this.http.post<any>(`${this.config}/groups/${uid}`, formData);
  }

  getGroups(uid: string): Observable<any> {
    return this.http.get<any>(`${this.config}/groups/${uid}`);
  }

  getItems(uid: string, group: string, options: any, exclude: boolean): Observable<any> {
    return this.http.get<any>(`${this.config}/items/${uid}?group=${group}&order=${options || 'default'}&hide-expired=${exclude}`);
  }

  createNewItem(formData: any): Observable<any> {
    return this.http.post<any>(`${this.config}/${this.authenticationService.currentUserValue.id}/groups/${formData.groupId}/items`, formData);
  }

  getItem(gid: string, iid: string): Observable<any> {
    return this.http.get<any>(`${this.config}/${this.authenticationService.currentUserValue.id}/groups/${gid}/items/${iid}`);
  }

  deleteItem(gid: string, iid: string): Observable<any> {
    return this.http.delete<any>(`${this.config}/${this.authenticationService.currentUserValue.id}/groups/${gid}/items/${iid}`);
  }

  deleteGroup(gid: string): Observable<any> {
    return this.http.delete<any>(`${this.config}/${this.authenticationService.currentUserValue.id}/groups/${gid}`);
  }

  filterGroups(): Observable<any> {
    return this.http.get<any>(`${this.config}/groups/${this.authenticationService.currentUserValue.id}?filter=true`)
  }
}
