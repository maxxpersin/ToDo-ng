import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { ToDoItem } from '../_models/to-do-item/to-do-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {

  id: string;
  item: ToDoItem;
  edit = false;

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.api.getItem(this.id)
      .subscribe(
        data => {
          this.item = data;
          let temp = new Date(this.item.date);
          this.item.date = temp;
        },
        error => {
          console.log(error);
        }
      );
  }

  openEdit() {
    this.edit = true;
  }

}
