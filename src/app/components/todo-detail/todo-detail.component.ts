import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Contact } from '../../models/contact.model';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { ContactService } from '../../services/contact.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-todo-detail',
  standalone: false,
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.css'
})
export class TodoDetailComponent implements OnInit {

  todo!: Todo;
  todoForm!: FormGroup;

  /*-----Contacts(chip)-----*/
  //create a new form
  currentContact = new FormControl('');
  //selected one
  selectedContacts: Contact[] = [];
  //all the items
  allContacts: Contact[] = [];
  //searching item
  filteredContacts: Contact[] = [];

  //Projects
  projects: Project[] = [];
  //Users
  users: any[] = [];

  //currentUser
  currentUser: any;

  listPriority = [
    { text: '1', value: 1 },
    { text: '2', value: 2 },
    { text: '3', value: 3 }
  ];

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private contactService: ContactService,
    private projectService: ProjectService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // I get the ID from the URL and convert it to a number
    // to call the fetch-by-ID function from the CRUD service

    /*-----Get ID from URL-----*/
    const id = Number(this.route.snapshot.paramMap.get('id'));

    /*-----load all infos-----*/

    // 1. get all users
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });

    // 2. get current user
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    // 3.get all Contacts
    this.contactService.getContacts().subscribe(contacts => {
      this.allContacts = contacts;
      this.filteredContacts = contacts;


      // get todo
      this.todoService.getTodo(id).subscribe(todo => {
        this.todo = todo;


        // initial selectedContacts(chips)
        if (this.todo.memberIds && this.allContacts.length) {
          this.selectedContacts = this.todo.memberIds
            .map(id => this.allContacts.find(c => c.id === id))
            .filter((c): c is Contact => c !== undefined);
        }

        // initial form
        this.todoForm = this.fb.group({
          id: [this.todo.id],
          title: [this.todo.title, Validators.required],
          completed: [this.todo.completed],
          priority: [this.todo.priority || 1],
          dueDate: [this.todo.dueDate || ''],
          description: [this.todo.description || ''],
          memberIds: [this.todo.memberIds || []],
          projectId: [this.todo.projectId || null],
          userIds: [this.todo.userIds || []]
        });
      });
    });

    // 4.get all projects
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });


  }


  onSubmit() {
    if (!this.todoForm.valid) return;

    const formValue = { ...this.todoForm.value };

    // duedate -> ISO string
    if (formValue.dueDate) {
      const date = new Date(formValue.dueDate);
      formValue.dueDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    }

    // 將 chips 選擇的 memberIds 寫回
    formValue.memberIds = this.selectedContacts.map(c => c.id);

    // priority => number
    formValue.priority = Number(formValue.priority);

    this.todoService.updateTodo(formValue).subscribe(() => {
      this.snackbar.open('Updated!', '', { duration: 1000 });
      this.router.navigate(['/todo-table']);
    });
  }

  onCancel() {
    //revenir sur la liste initiale apres sauvegarde
    this.router.navigate(['/']);
  }

  /*-----chips-----*/
  remove(id: number) {
    this.selectedContacts = this.selectedContacts.filter(c => c.id !== id);
  }

  //filter contacts
  onCurrentUserChange(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredContacts = this.allContacts.filter(c =>
      c.firstName.toLowerCase().includes(filterValue)
    );
  }

  //select contacts
  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedId = Number(event.option.value);
    const selectedUser = this.allContacts.find((c) => c.id === selectedId);

    if (selectedUser && !this.selectedContacts.some((c) => c.id === selectedId)) {
      this.selectedContacts.push(selectedUser);
    }

    this.currentContact.setValue('');


    /*fruits:*/
    //this.selectedFruits = [...this.selectedFruits, event.option.viewValue];
    //this.currentFruit.setValue('');
    //event.option.deselect();

    //console.log(this.currentFruit.value)
  }

}

