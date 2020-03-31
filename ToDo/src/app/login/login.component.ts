import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.api.login(this.loginForm.value)
      .subscribe(
        data => {
          this.api.user.next(data);

          localStorage.setItem('user', JSON.stringify(data));

          this.router.navigate(['']);
        },
        error => {
          console.log(error);
        }
      )
  }
}
