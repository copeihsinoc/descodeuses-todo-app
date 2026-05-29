import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { ProjectService } from './services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from './models/project.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from './models/contact.model';
import { ContactService } from './services/contact.service';
import { TodoService } from './services/todo.service';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  title = 'KittyTasks';

  navLinks = [
    { path: 'dashboard', label: 'Dashboard', icon: 'home' },
    { path: 'to-do-list', label: 'Tasks', icon: 'check' },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { path: 'profile', label: 'Profile', icon: 'person' },
        // 只有 Admin 可見
        { path: 'user', label: 'Users', icon: 'group', requiresAdmin: true }
      ]
    },
    { path: 'log-out', label: 'Logout', icon: 'logout' },
  ];

  // Sidebar data
  tasksSummary: any[] = [];
  projects: Project[] = [];
  contacts: Contact[] = [];

  // Forms
  projectForm: FormGroup;
  contactForm: FormGroup;

  //記錄當前主選單是否展開子選單
  activeMainLink: any = null;
  // Tasks 是否被點擊
  activeTasks = false;

  isEntryPage = false;
  isLoggedIn = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private todoService: TodoService,
    private projectService: ProjectService,
    private contactService: ContactService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.group({
      project: ['', Validators.required]
    });
    this.contactForm = this.fb.group({
      contact: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkLoginStatus();

    // 監聽路由變化，即時更新 isLoggedIn 與 isEntryPage
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
      
      const url = this.router.url;
      this.isEntryPage = url.includes('login') || url.includes('signup') || url === '/';

      if (this.isLoggedIn) {
        if (this.isEntryPage) {
          this.router.navigate(['/dashboard']);
        } else {
          this.loadAllData();
        }
      } else if (!this.isEntryPage) {
        this.router.navigate(['/login']);
      }
    });
  }

  // 封裝登入檢查邏輯
  checkLoginStatus() {
    const token = sessionStorage.getItem('authToken');
    this.isLoggedIn = !!token;
  }

  // 安全的切換側邊欄方法
  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  // 封裝所有抓取動作
  loadAllData() {
    this.fetchTasks();
    this.todoService.refreshKPIs();
    this.fetchProjects();
    this.fetchContacts();
  }

  // 點擊主選單
  openSubMenu(link: any) {
    if (link.children) {
      this.activeMainLink = link; 
      this.activeTasks = false;
    } else if (link.path === 'to-do-list') {
      this.activeTasks = true;
      this.activeMainLink = null;
      this.loadAllData();
      this.router.navigate(['/to-do-list']);
    } else if (link.path) {
      this.router.navigate([link.path]);
      this.activeMainLink = null;
      this.activeTasks = false;
    }
  }

  /* -----Tasks----- */
  fetchTasks() {
    // 🌟 這裡加上 (summary: any[]) 告訴它是一個陣列
    this.todoService.kpiSummary$.subscribe((summary: any[]) => {
      this.tasksSummary = summary;
    });
  } 

  /* -----Project----- */
  fetchProjects() {
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
    });
  }

  addProject() {
    if (this.projectForm.valid) {
      const project: Project = {
        id: null,
        title: this.projectForm.value.project,
        description: null
      };
      this.projectService.addProject(project).subscribe(() => {
        this.snackBar.open('Project added!', '', { duration: 1000 });
        this.projectForm.reset();
        this.fetchProjects();
      });
    }
  }

  deleteProject(id: number | null) {
    if (id === null) return;
    this.projectService.deleteProject(id).subscribe(() => {
      this.fetchProjects();
      this.snackBar.open('Deleted !', '', { duration: 1000 });
    });
  }

  /* -----Contact----- */
  fetchContacts() {
    this.contactService.getContacts().subscribe((data) => {
      this.contacts = data;
    });
  }

  addContact() {
    if (this.contactForm.valid) {
      const fullName = this.contactForm.value.contact.trim();
      const [firstName, lastName] = fullName.split(' ');
      const newContact: Contact = {
        id: null,
        firstName: firstName || '',
        lastName: lastName || '',
        genre: 'unknown'
      };
      this.contactService.addContact(newContact).subscribe(() => {
        this.fetchContacts();
        this.snackBar.open('Contact added!', '', { duration: 1000 });
        this.contactForm.reset();
      });
    }
  }

  deleteContact(id: number | null) {
    if (id === null) return;
    this.contactService.deleteContact(id).subscribe(() => {
      this.fetchContacts();
      this.snackBar.open('Deleted !', '', { duration: 1000 });
    });
  }

  backToMainMenu() {
    this.activeMainLink = null;
    this.activeTasks = false;
  }

  closeSidenav() {
    if (window.innerWidth < 768 && this.sidenav) {
      this.sidenav.close();
    }
  }
}