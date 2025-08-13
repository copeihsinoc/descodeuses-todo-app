import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'My Tasks';

  navLinks = [
    { path: '', label: 'Home' },
    { path: 'profile', label: 'Profile' },
    //{ path: 'signup', label: 'Sign up' },
    { path: 'to-do-list', label: 'To-Do List' },
    { path: 'user', label: 'User List' },
    { path: 'todo-table', label: 'To-do Table' },
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'log-out', label: 'Log out' },
  ];

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    if (!this.authService.isAdmin) {
      this.router.navigate(['/']);
    }

  }

  //version mobile
  closeSidenav() {
    if (window.innerWidth < 768) { 
      this.sidenav.close();
    }
  }
}
