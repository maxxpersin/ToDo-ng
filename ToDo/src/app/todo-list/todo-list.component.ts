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

  getToDoItems() {
    //this.api.
  }

  getAuth() {
    this.api.getAuth().subscribe( data => {
      console.log(data);
    });
  }

}
