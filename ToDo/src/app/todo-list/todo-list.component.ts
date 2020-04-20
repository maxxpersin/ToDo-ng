import { Component, OnInit } from '@angular/core';
import { ToDoItem } from '../_models/to-do-item/to-do-item';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../_services/api/api.service';
import { User } from '../_models/user/user';
import { Router, ActivatedRoute } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { AuthenticationService } from '../_services/authentication-service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  toDoItems: ToDoItem[] = [];
  groupId: string;
  isChecked = true;
  order = 'default';

  constructor(
    private api: ApiService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService, private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.groupId = this.route.snapshot.paramMap.get('gid');
    this.getToDoItems();
  }

  pastCompleteBy(item: ToDoItem) {
    return item.date.getTime() <= Date.now();
  }

  getToDoItems() {
    this.spinner.show();
    this.api.getItems(this.authenticationService.currentUserValue.id, this.groupId, '', !this.isChecked)
      .subscribe(
        data => {
          this.toDoItems = data;
          this.formatDate(this.toDoItems);
          this.spinner.hide();
        }, error => {
          if (error.status > 400) {
            this.authenticationService.logout();
          }
        }
      );
  }

  updateTable(display: any, choice: any) {
    this.spinner.show();
    this.api.getItems(this.authenticationService.currentUserValue.id, this.groupId, choice, !display)
      .subscribe(
        data => {
          this.toDoItems = data;
          this.formatDate(this.toDoItems);
          this.spinner.hide();
        }, error => {
          if (error.status > 400) {
            this.authenticationService.logout();
          }
        }
      );
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

  deleteGroup() {
    this.api.deleteGroup(this.groupId)
      .subscribe(
        data => {
          this.toastr.success('Group successfully deleted');
          this.router.navigate(['/']);
        }, error => { if (error.status > 400) this.authenticationService.logout() }
      );
  }
}
