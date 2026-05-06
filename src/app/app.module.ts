import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// ✅ 1. 核心 HTTP 導入
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor'; 

// --- Material 模組導入 ---
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnregistrerComponent } from './components/enregistrer/enregistrer.component';
import { MatSelectModule } from '@angular/material/select';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { MatCardModule } from '@angular/material/card';
import { UserListComponent } from './components/user-list/user-list.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TodoTableComponent } from './components/todo-table/todo-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SignupComponent } from './components/signup/signup.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { LogOutComponent } from './components/log-out/log-out.component';
import { MatExpansionModule } from '@angular/material/expansion';

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
    ProjectDetailComponent,
    LogOutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // ✅ 2. 必須有這個才能發送請求
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
    MatAutocompleteModule,
    FormsModule,
    MatExpansionModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    //provideHttpClient(),

// ✨ 這裡才是真正的魔法！強制註冊攔截器
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    //injecter in-memory-data.service.ts
    //comme il est @Injectable-
    /*
    importProvidersFrom([
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService,{delay:200})
    ]),
     */
    { provide: LOCALE_ID, useValue: 'fr'}
    
  ],
  
  bootstrap: [AppComponent]

//localisation pour affichage en format francais (devise, date...)    
    })


export class AppModule { }
