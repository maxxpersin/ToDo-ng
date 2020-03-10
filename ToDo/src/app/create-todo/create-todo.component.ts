import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

  toDoForm = new FormGroup({
    title: new FormControl(''),
    date: new FormControl(''),
    description: new FormControl(''),
  });

  submitted = false;

  constructor() { 
    
  }

  

  ngOnInit(): void {

  }

  onSubmit(){
    console.log(this.toDoForm.value);
    this.submitted = true;
  }

}
