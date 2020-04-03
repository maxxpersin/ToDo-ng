import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { User } from '../_models/user/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  user: User;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.api.getUser();

    if (!this.user && this.router.url != '/login' && this.router.url != '/register') {
      this.router.navigate(['/login'])
    }
  }

  logout() {
    this.api.logout();
  }

}
