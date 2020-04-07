import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../_services/api/api.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  });

  showError = false;
  submitted = false;

  constructor(private api: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.toDoForm.valid) {
      this.api.createNewItem(this.toDoForm.value)
        .subscribe(
          data => {
            this.toastr.success('Item created');
            this.router.navigate(['/']);
          },
          error => {
            console.log(error);
          }
        );
    } else {
      this.showError = true;
    }
  }
}
