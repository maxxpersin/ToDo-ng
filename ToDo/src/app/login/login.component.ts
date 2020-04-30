import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication-service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  loginError = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  showError() {
    this.loginError = true;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value).subscribe(
        data => {
          this.authenticationService.currentUserSubject.next(data);
          localStorage.setItem('user', JSON.stringify(data));
          this.router.navigate(['/']);
        },
        error => {
          this.showError();
        }
      );
    }
  }
}
