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

@Component({
  selector: 'app-todo-detail',
  standalone: false,
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.css'
})
export class TodoDetailComponent implements OnInit {

  /*-----1-----*/
  //create a new form
  currentContact = new FormControl('');
  //selected one
  selectedContacts: Contact[] = [];
  //all the items
  allContacts: Contact[] = [];
  //searching item
  filteredContacts: Contact[] = [];

  todo!: Todo;
  formGroup!: FormGroup;

  listPriority = [
    { text: '1', value: 1 },
    { text: '2', value: 2 },
    { text: '3', value: 3 }
  ];

  /*project table */
  projects: Project[] = [];

  userFullName: string = '';

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private contactService: ContactService,
    private projectService: ProjectService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    // I get the ID from the URL and convert it to a number
    // to call the fetch-by-ID function from the CRUD service

    /*-----Get ID from URL-----*/
    const id = Number(this.route.snapshot.paramMap.get('id'));


    /*-----get contacts first-----*/
    //ensure allContacts is ready, so you can safely map IDs to full objects.
    this.contactService.getContacts().subscribe(contacts => {
      this.allContacts = contacts;
      this.filteredContacts = contacts;


      // get todo
      this.todoService.getTodo(id).subscribe(data => {
        this.todo = data;

        // Show username from userId in input.
        if (this.todo.userId !== undefined) {
          this.userService.getUser(this.todo.userId).subscribe(user => {
            this.userFullName = `${user.firstname} ${user.lastname}`;
          });
        }

        // initial selectedContacts
        if (this.todo.memberIds && this.allContacts.length) {
          this.selectedContacts = this.todo.memberIds
            .map((memberId: number) => this.allContacts.find(c => c.id === memberId))
            .filter((c): c is Contact => c !== undefined); // 避免 undefined
        }

        // initial form
        this.formGroup = this.fb.group({
          id: [this.todo.id],
          title: [this.todo.title, Validators.required],
          completed: [this.todo.completed],
          priority: [Number(this.todo.priority)],
          dueDate: [this.todo.dueDate],
          description: [this.todo.description],
          memberIds: [this.todo.memberIds || []],
          projectId: [this.todo.projectId || null],
        });
      });
    });

    //get all projects
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }



  onSubmit() {
    if (!this.formGroup.valid) return;

    //only send id to back
    this.formGroup.patchValue({
      memberIds: this.selectedContacts.map(c => c.id)
    });

    const formValue = { ...this.formGroup.value };

    // date
    if (formValue.dueDate) {
      formValue.dueDate = this.toLocalIsoString(formValue.dueDate);
    }

    // priority => number
    formValue.priority = Number(formValue.priority);

    // Ensure userId is not null
    // Current user id = 1
    formValue.userId = this.todo.userId ?? 1; 

    console.log('Sending data:', formValue);

    this.todoService.updateTodo(formValue).subscribe(() => {
      this.snackbar.open('Updated!', '', { duration: 1000 });
      this.router.navigate(['/todo-table']);
    });
  }


  onCancel() {
    //revenir sur la liste initiale apres sauvegarde
    this.router.navigate(['/']);
  }

  toLocalIsoString(dateString: string): string {
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
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

