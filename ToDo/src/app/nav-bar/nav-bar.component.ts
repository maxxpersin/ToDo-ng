import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  user = this.api.user;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  logout() {
    this.api.logout();
  }

}
