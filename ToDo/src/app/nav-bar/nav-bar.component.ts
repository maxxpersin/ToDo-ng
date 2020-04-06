import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication-service/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService , private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  logout() {
    this.authenticationService.logout();
  }

}
