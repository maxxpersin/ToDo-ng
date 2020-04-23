import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { AuthenticationService } from '../_services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.css']
})
export class ListGroupComponent implements OnInit {

  groups = [];
  isChecked = true;

  constructor(
    private api: ApiService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getGroups();
  }

  getItemsOfGroups(groups: any) {
    if (groups.length > 0) {
      groups.forEach(group => {
        this.api.getItems(this.authenticationService.currentUserValue.id, group.groupId, 'default', false)
          .subscribe(
            data => {
              group.items = data;
              this.spinner.hide();
            }, error => {
              if (error.status > 400) {
                this.authenticationService.logout();
              }
            }
          );
      });
    } else {
      this.spinner.hide();
    }
  }

  getGroups() {
    this.spinner.show();
    this.api.getGroups(this.authenticationService.currentUserValue.id)
      .subscribe(
        data => {
          this.groups = data;
          this.getItemsOfGroups(this.groups);
        }, error => {
          if (error.status > 400) {
            this.authenticationService.logout();
          };
        }
      );
  }

  updateGroups(evt: any) {
    this.spinner.show();
    if (!evt) {
      this.api.filterGroups()
        .subscribe(
          data => {
            this.groups = data;
            this.getItemsOfGroups(this.groups);
          }, error => {
            if (error.status > 400) {
              this.authenticationService.logout();
            }
          }
        );
    } else {
      this.getGroups();
    }
  }

}
