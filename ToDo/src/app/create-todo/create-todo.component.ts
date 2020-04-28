import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../_services/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../_services/authentication-service/authentication.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

  toDoForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    date: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    groupId: new FormControl(this.route.snapshot.paramMap.get('gid'))
  });

  showError = false;
  submitted = false;

  gid = this.route.snapshot.paramMap.get('gid');

  constructor(private api: ApiService, private authenticationService: AuthenticationService, private router: Router, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.toDoForm.valid) {
      let date = new Date(this.toDoForm.value.date);
      date.setDate(date.getDate() + 1);
      this.toDoForm.patchValue({ date: date });
      this.api.createNewItem(this.toDoForm.value)
        .subscribe(
          data => {
            this.toastr.success('Item created');
            this.router.navigate([`group/${this.gid}`]);
          },
          error => {
            if (error.status > 400) {
              this.authenticationService.logout();
            }
          }
        );
    } else {
      this.showError = true;
    }
  }
}
