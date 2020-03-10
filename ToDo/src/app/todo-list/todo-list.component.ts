import { Component, OnInit } from '@angular/core';
import { ToDoItem } from '../to-do-item';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  toDoItems: ToDoItem[] = [];

  constructor() { }

  ngOnInit(): void {
    //this.getToDoItems();
  }

  getToDoItems() {
    //this.api.
  }

}
