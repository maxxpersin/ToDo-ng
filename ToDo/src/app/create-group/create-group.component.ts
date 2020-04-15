import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../_services/api/api.service';
import { AuthenticationService } from '../_services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  groupForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  showError = false;

  constructor(
    private api: ApiService,
    private authentication: AuthenticationService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.groupForm.valid) {
      console.log(this.groupForm.value);
      this.api.createNewGroup(this.authentication.currentUserValue.id, this.groupForm.value)
        .subscribe(
          data => {
            this.router.navigate(['/']);
            this.toastr.success('Group created')
          }, error => { this.toastr.error('Group could not be created'); }
        )
      this.router.navigate(['/']);
    } else {
      this.showError = true;
    }
  }

}
