import { Component, OnInit } from '@angular/core';
import { ToDoItem } from '../to-do-item';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../_services/api/api.service';
import { User } from '../_models/user/user';
import { Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  toDoItems: ToDoItem[] = [];
  user: User;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.api.getUser();
    if (this.user){
      this.getToDoItems();
    } else {
      //this.router.navigate(['/login']);
    }
  }

  getToDoItems() {
    this.api.getItems(this.user.id)
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
