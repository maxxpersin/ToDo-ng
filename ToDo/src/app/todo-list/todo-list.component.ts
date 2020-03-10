import { Component, OnInit } from '@angular/core';
import { ToDoItem } from '../to-do-item';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  toDoItems: ToDoItem[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getAuth();
  }

  getToDoItems(uid: string) {
    this.api.getItems(uid)
      .subscribe(
        data => {
          if (data.status == 400) {
            localStorage.removeItem('uid');
            this.getAuth();
          } else {
            this.toDoItems = data;
          }
        }, error => {
          console.log(error);
        }
      );
  }

  getAuth() {
    let uid: string;
    if (localStorage.getItem('uid')) {
      uid = localStorage.getItem('uid');
      this.getToDoItems(uid);
      return;
    }

    this.api.getAuth().subscribe(data => {
      localStorage.setItem('uid', data.id);
      this.getToDoItems(data.id);
    });

  }
}
