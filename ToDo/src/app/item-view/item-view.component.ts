import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { ToDoItem } from '../to-do-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {

  id: string;
  item: ToDoItem;

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    //this.id = this.route.snapshot.paramMap.get('id');

    // this.api.getItem(localStorage.getItem('uid'), this.id)
    //   .subscribe(
    //     data => {
    //       this.item = data;
    //       console.log(this.item);
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
  }

}
