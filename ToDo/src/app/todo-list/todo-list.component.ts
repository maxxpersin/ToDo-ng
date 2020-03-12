import { Component, OnInit } from '@angular/core';
import { ToDoItem } from '../to-do-item';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../_services/api/api.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  toDoItems: ToDoItem[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getUser();
    if (this.api.user){
      this.getToDoItems();
    }
  }

  getToDoItems() {
    this.api.getItems(this.api.user.id)
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
