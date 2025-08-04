import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import { TodoTableComponent } from './components/todo-table/todo-table.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { SignupComponent } from './components/signup/signup.component';

/* path: lien saisi dans la barre de navigation
   component: le composant relie a ce path
*/
const routes: Routes = [
  {path:"", component:LoginComponent},
  {path:"profile", component:ProfileComponent, canActivate: [authGuard]},
  {path:"signup", component:SignupComponent},
  {path:"to-do-list", component:ToDoListComponent, canActivate: [authGuard]}, 
  {path:"user", component:UserListComponent, canActivate: [authGuard]},
  {path:"todo-detail/:id", component:TodoDetailComponent, canActivate: [authGuard]},
  {path:"todo-table", component:TodoTableComponent, canActivate: [authGuard]},
  {path:"dashboard", component:DashboardComponent, canActivate: [authGuard]}//path vide car page par defaut(index)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
