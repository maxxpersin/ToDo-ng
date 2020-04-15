import { Component, OnInit } from '@angular/core';
import { ToDoItem } from '../_models/to-do-item/to-do-item';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../_services/api/api.service';
import { User } from '../_models/user/user';
import { Router, ActivatedRoute } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { AuthenticationService } from '../_services/authentication-service/authentication.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  toDoItems: ToDoItem[] = [];
  groupId: string;

  constructor(private api: ApiService, private authenticationService: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('gid');
    this.getToDoItems();
  }

  pastCompleteBy(item: ToDoItem) {
    return item.date.getTime() <= Date.now();
  }

  getToDoItems() {
    this.api.getItems(this.authenticationService.currentUserValue.id, this.groupId, '')
      .subscribe(
        data => {
          this.toDoItems = data;
          this.formatDate(this.toDoItems);
        }, error => {
          console.log(error);
        }
      );
  }

  updateTable(choice: any) {
    this.api.getItems(this.authenticationService.currentUserValue.id, this.groupId, choice)
      .subscribe(
        data => {
          this.toDoItems = data;
          this.formatDate(this.toDoItems);
        }, error => {
          console.log(error);
        }
      )
  }

  formatDate(items: ToDoItem[]) {
    this.toDoItems.forEach(item => {
      let temp = new Date(item.date);
      item.date = temp;
    });
  }

  goToCreateToDo() {
    this.router.navigate([`group/${this.groupId}/create-todo`]);
  }

  toItemView(iid: string) {
    this.router.navigate([`group/${this.groupId}/item/view/${iid}`]);
  }
}
