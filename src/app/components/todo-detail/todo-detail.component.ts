import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  styleUrl: './todo-detail.component.css',
})
export class TodoDetailComponent implements OnInit {

  // 0 = 新增, >0 = 編輯
  @Output() close = new EventEmitter<void>();

  private _todoId: number | null = null;
  @Input() set todoId(id: number | null | undefined) {
    this._todoId = id ?? null;
    if (this._todoId === null || this._todoId <= 0) {
      this.isNewTodo = true;
      this.initForm(); // 新增模式
      this.loadDropdowns();
    } else {
      this.isNewTodo = false;
      this.loadDropdowns(() => this.loadTodo(this._todoId!)); // 先載入下拉資料，再載入 todo

    }
  }

  isNewTodo = true;
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

  get todoTitle(): string {
    return this.todoForm?.get('title')?.value || '';
  }

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
    this.initForm(); // 預設初始化 form
  }

  /** 初始化空表單 */
  private initForm() {
    this.todoForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      completed: [false],
      priority: [1],
      dueDate: [''],
      description: [''],
      memberIds: [[]],
      projectId: [null],
      userIds: [[]]
    });
    this.selectedContacts = [];
  }

  /** 載入下拉資料: projects, users, contacts */
  private loadDropdowns(callback?: () => void) {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      if (callback) callback();
    });

    this.contactService.getContacts().subscribe(contacts => {
      this.allContacts = contacts;
      this.filteredContacts = contacts;
    });

    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });

    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  /** 載入單一 Todo 的資料 (編輯模式) */
  private loadTodo(id: number) {
    this.todoService.getTodo(id).subscribe(todo => {
      this.todo = todo;

      this.todoForm.patchValue({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        priority: todo.priority || 1,
        dueDate: todo.dueDate || '',
        description: todo.description || '',
        memberIds: todo.memberIds || [],
        projectId: todo.projectId || null,
        userIds: todo.userIds || []
      });

      // 初始化 chip 選擇
      if (todo.memberIds && this.allContacts.length) {
        this.selectedContacts = todo.memberIds
          .map(id => this.allContacts.find(c => c.id === id))
          .filter((c): c is Contact => c !== undefined);
      }
    });
  }
  /*-----load all infos-----
  private loadData(id: number) {

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
      if (!this.isNewTodo && id > 0) {
        this.todoService.getTodo(id).subscribe(todo => {
          this.todo = todo;

          // 用 patchValue 更新 form
          this.todoForm.patchValue({
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
            priority: todo.priority || 1,
            dueDate: todo.dueDate || '',
            description: todo.description || '',
            memberIds: todo.memberIds || [],
            projectId: todo.projectId || null,
            userIds: todo.userIds || []
          });


          // initial selectedContacts(chips)
          if (this.todo.memberIds && this.allContacts.length) {
            this.selectedContacts = this.todo.memberIds
              .map(id => this.allContacts.find(c => c.id === id))
              .filter((c): c is Contact => c !== undefined);
          }
        });
      }
    });

    // 4.get all projects
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });

  }
*/

  onSave() {

    if (!this.todoForm || !this.todoForm.valid) {
      return;
    }

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

    if (this.isNewTodo) {
      // 新增不帶 id
      delete formValue.id;
      this.todoService.addTodo(formValue).subscribe(() => {
        this.snackbar.open('Created!', '', { duration: 1000 });
        this.close.emit();

      });
    } else {
      this.todoService.updateTodo(formValue).subscribe(() => {
        this.snackbar.open('Updated!', '', { duration: 1000 });
        this.close.emit();
      });
    }
  }

  onCancel() {
    this.close.emit();
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
  }

}

