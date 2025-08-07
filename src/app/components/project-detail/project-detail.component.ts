import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: false,
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {

  formGroup!: FormGroup;
  project!: Project;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.projectService.getProject(id).subscribe({
      next: data => {
        if (!data) {
          console.error('Project not found');
          return; 
        }

        this.project = data;

        this.formGroup = this.fb.group({
          id: [this.project.id],
          title: [this.project.title, Validators.required],
          dueDate:[this.project.dueDate],
          description: [this.project.description],
        });
      },
      error: err => {
        console.error('Task error:', err);
      }
    });
  }

  onSubmit() {

    //tester si formulaire valide
    if (this.formGroup.valid) {
      const formValue = { ...this.formGroup.value };

      console.log("send format:", JSON.stringify(formValue));


      //faire appel au update du service CRUD
      this.projectService.updateProject(formValue).subscribe(data => {

        this.snackbar.open('Updated!', '', { duration: 1000 });
        this.router.navigate(['/to-do-list']);
      })
    }
  }

  onCancel() {
    //revenir sur la liste initiale apres sauvegarde
    this.router.navigate(['/']);
  }

}
