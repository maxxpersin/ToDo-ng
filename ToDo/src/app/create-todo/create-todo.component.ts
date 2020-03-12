import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../_services/api/api.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

  toDoForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    date: new FormControl(''),
    description: new FormControl(''),
  });

  submitted = false;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit() {
    console.log(this.toDoForm.value);
    this.submitted = true;

    this.api.createNewItem(localStorage.getItem('uid'), this.toDoForm.value)
      .subscribe(
        data => {
          console.log(data);
          this.router.navigate(['/']);
        },
        error => {
          console.log(error);
        }
      );

  }

}
