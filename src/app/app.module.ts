import { importProvidersFrom, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { EnregistrerComponent } from './components/enregistrer/enregistrer.component';
import {MatSelectModule} from '@angular/material/select';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import {MatCardModule} from '@angular/material/card';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api'
import { InMemoryDataService } from './services/in-memory-data.service';
import { UserListComponent } from './components/user-list/user-list.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import {provideNativeDateAdapter} from '@angular/material/core';
import { TodoTableComponent } from './components/todo-table/todo-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule } from '@angular/material/autocomplete';
import { authInterceptor } from './auth/auth.interceptor';
import { SignupComponent } from './components/signup/signup.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    EnregistrerComponent,
    ToDoListComponent,
    UserListComponent,
    TodoDetailComponent,
    TodoTableComponent,
    DashboardComponent,
    SignupComponent,
    ProjectDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatTableModule,
    MatSortModule,
    MatGridListModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  providers: [
    provideNativeDateAdapter(),

    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),
    //injecter in-memory-data.service.ts
    //comme il est @Injectable-
    /*
    importProvidersFrom([
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService,{delay:200})
    ]),
     */
    { provide: LOCALE_ID, useValue: 'fr'}
    
  ],
  bootstrap: [AppComponent],

//localisation pour affichage en format francais (devise, date...)    
    })


export class AppModule { }
