import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { CreateTodoComponent } from './create-todo/create-todo.component';
import { ItemViewComponent } from './item-view/item-view.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ListGroupComponent } from './list-group/list-group.component';
import { AuthGuard } from './_utilities/auth-guard';
import { CreateGroupComponent } from './create-group/create-group.component';


const routes: Routes = [
  { path: '', component: ListGroupComponent, canActivate: [AuthGuard] },
  { path: 'group/:gid', component: TodoListComponent, canActivate: [AuthGuard] },
  { path: 'create-group', component: CreateGroupComponent, canActivate: [AuthGuard] },
  { path: 'create-todo', component: CreateTodoComponent, canActivate: [AuthGuard] },
  { path: 'item/view/:id', component: ItemViewComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
