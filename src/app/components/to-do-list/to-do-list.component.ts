import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-to-do-list',
  standalone: false,
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent implements OnInit {

  formGroup: FormGroup;

  todos: Todo[] = [];

  projects: Project[] = [];

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private snackBar: MatSnackBar,
    private projectService: ProjectService
  ) {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchTodo();
    this.fetchProject();
  }

  fetchTodo() {
    //Communication asynchrone donc il faut ecouter le retour
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  onAddTodo() {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;

      const todo: Todo = {
        id: null, //id est genere sur le serveur pour cela il est envoye null
        title: formValue.title, //Seulement title est remplis depuis le formulaire
        completed: false,
        priority: null,
        dueDate: '',
        description: null
      };

      this.todoService.addTodo(todo).subscribe(data => {
        //Actualiser la liste apres l'ajout
        this.fetchTodo();
      });
    }
  }

  onDeleteTodo(id: number | null) {
    if (id === null)
      return; //pas de retour

    this.todoService.deleteTodo(id).subscribe(() => {
      this.fetchTodo();
      this.snackBar.open('Deleted !', '', { duration: 1000 });
    });
  }

  onCheckChange(event: MatCheckboxChange, todo: Todo) {
    console.log(event.checked);
    todo.completed = event.checked;

    //mis a jour dans l'api
    this.todoService.updateTodo(todo).subscribe(data => {   //subscribe ecouter le retour
      this.fetchTodo();

      if (todo.completed) {
        this.snackBar.open('checked !', '', { duration: 1000 });
      } else {
        this.snackBar.open('unchecked !', '', { duration: 1000 });
      }
    });
  }



  /*-----Project----- */

  fetchProject() {
    //Communication asynchrone donc il faut ecouter le retour
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
    });
  }

  addProject() {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;

      const project: Project = {
        id: null, //id est genere sur le serveur pour cela il est envoye null
        title: formValue.title, //Seulement title est remplis depuis le formulaire
        description: null
      };

      this.projectService.addProject(project).subscribe(data => {
        //Actualiser la liste apres l'ajout
        this.fetchProject();
      });
    }
  }

  deleteProject(id: number | null) {
    if (id === null)
      return; //pas de retour

    this.projectService.deleteProject(id).subscribe(() => {
      this.fetchProject();
      this.snackBar.open('Deleted !', '', { duration: 1000 });
    });
  }
}
//this.todoService.updateTodo(todo).subscribe(data => {
// console.log(data);
// this.snackBar.open('Updated !', '', {duration:1000});


