import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { CreateTodoComponent } from './create-todo/create-todo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ItemViewComponent } from './item-view/item-view.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { ListGroupComponent } from './list-group/list-group.component';
import { CreateGroupComponent } from './create-group/create-group.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TodoListComponent,
    CreateTodoComponent,
    ItemViewComponent,
    RegisterComponent,
    LoginComponent,
    ListGroupComponent,
    CreateGroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
