import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { ProjectService } from './services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from './models/project.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from './models/contact.model';
import { ContactService } from './services/contact.service';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  title = 'My Tasks';

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
    //確認使用者角色
    console.log('User is admin:', this.authService.isAdmin);

    if (!this.authService.isAdmin) {
      this.router.navigate(['/']);
    }
    this.fetchTasks();
    this.fetchProjects();
    this.fetchContacts();
  }

  // 點擊主選單
  openSubMenu(link: any) {
    if (link.children) {
      this.activeMainLink = link; // 保留完整子選單
      this.activeTasks = false;

    } else if (link.path === 'to-do-list') {
      // 點 Tasks
      this.activeTasks = true;
      this.activeMainLink = null;

      //make sure it loads data
      this.fetchTasks();
      this.fetchProjects();
      this.fetchContacts();

      // 導向 route
      this.router.navigate(['/to-do-list']);

    } else if (link.path) {
      //dashboard/logout
      this.router.navigate([link.path]);
      this.activeMainLink = null;
      this.activeTasks = false;
    }
  }

  /* -----Tasks----- */
  fetchTasks() {
    this.todoService.getTodos().subscribe((todos) => {
      const today = new Date();

      const countToday = todos.filter(t => new Date(t.dueDate).toDateString() === today.toDateString()).length;
      const countUrgent = todos.filter(t => t.priority === '1' && !t.completed).length;
      const countOverdue = todos.filter(t => new Date(t.dueDate) < today && !t.completed).length;

      this.tasksSummary = [
        { label: "Today's Tasks", icon: 'today', count: countToday },
        { label: 'Urgent', icon: 'priority_high', count: countUrgent },
        { label: 'Overdue', icon: 'warning', count: countOverdue }
      ];
    });
  }

  /* -----Project----- */

  fetchProjects() {
    //Communication asynchrone donc il faut ecouter le retour
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
    });
  }

  addProject() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;

      const project: Project = {
        id: null, //id est genere sur le serveur pour cela il est envoye null
        title: formValue.project, //Seulement title est remplis depuis le formulaire
        description: null
      };

      this.projectService.addProject(project).subscribe(data => {
        //Actualiser la liste apres l'ajout
        this.snackBar.open('Project added!', '', { duration: 1000 });
        this.projectForm.reset();
        this.fetchProjects();
      });
    }
  }
  deleteProject(id: number | null) {
    if (id === null)
      return; //pas de retour

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
        this.fetchContacts(); // 刷新列表
        this.snackBar.open('Contact added!', '', { duration: 1000 });
        this.contactForm.reset();
      });
    }
  }
  deleteContact(id: number | null) {
    if (id === null)
      return; //pas de retour

    this.contactService.deleteContact(id).subscribe(() => {
      this.fetchContacts();
      this.snackBar.open('Deleted !', '', { duration: 1000 });
    });
  }


  backToMainMenu() {
    this.activeMainLink = null;
    this.activeTasks = false;
  }

  //version mobile
  closeSidenav() {
    if (window.innerWidth < 768) {
      this.sidenav.close();
    }
  }
}
