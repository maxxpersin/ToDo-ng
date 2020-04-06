import { Component, OnInit } from '@angular/core';
import { ToDoItem } from '../to-do-item';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../_services/api/api.service';
import { User } from '../_models/user/user';
import { Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  toDoItems: ToDoItem[] = [];

  constructor(private api: ApiService, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.getToDoItems();
  }

  getToDoItems() {
    this.api.getItems(this.authenticationService.currentUserValue.id)
      .subscribe(
        data => {
          console.log(data);
          this.toDoItems = data;
        }, error => {
          console.log(error);
        }
      );
  }
}
