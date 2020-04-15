import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../_services/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
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
    groupId: new FormControl(this.route.snapshot.paramMap.get('gid'))
  });

  showError = false;
  submitted = false;

  constructor(private api: ApiService, private router: Router, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.toDoForm.valid) {
      this.api.createNewItem(this.toDoForm.value)
        .subscribe(
          data => {
            this.toastr.success('Item created');
            this.router.navigate([`group/${this.route.snapshot.paramMap.get('gid')}`]);
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
