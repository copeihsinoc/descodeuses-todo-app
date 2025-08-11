import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Todo-list';

  navLinks = [
    { path: '', label: 'Home' },
    { path: 'profile', label: 'Profile' },
    { path: 'signup', label: 'Sign-up' },
    { path: 'to-do-list', label: 'To-Do List' },
    { path: 'user', label: 'User-list' },
    { path: 'todo-table', label: 'todo-table' },
    { path: 'dashboard', label: 'dashboard' },
  ];

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    if (!this.authService.isAdmin) {
      this.router.navigate(['/']);
    }

  }

}
