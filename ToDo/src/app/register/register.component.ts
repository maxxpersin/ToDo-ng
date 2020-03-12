import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../_models/user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.api.registerUser(this.registerForm.value)
      .subscribe(
        data => {
          //this.api.user = data;
          localStorage.setItem('user', JSON.stringify(data));
          this.router.navigate(['/login']);
        },
        error => {
          alert('That email is already assigned to a user');
          this.router.navigate(['/login']);
        }
      );
  }
}
