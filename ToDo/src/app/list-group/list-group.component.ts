import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { AuthenticationService } from '../_services/authentication-service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.css']
})
export class ListGroupComponent implements OnInit {

  groups = [];

  constructor(private api: ApiService, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
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

  getItemsOfGroups(groups) {
    groups.forEach(group => {
      this.api.getItems(this.authenticationService.currentUserValue.id, group.groupId, 'default')
        .subscribe(
          data => {
            group.items = data;
          }, error => {
            if (error.status > 400) {
              this.authenticationService.logout();
            }
          }
        )
    });
  }

}
