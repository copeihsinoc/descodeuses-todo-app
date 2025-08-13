import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  signUpForm!: FormGroup;
  user: User[] = [];

  genre = [
    { text: 'Femme', value: 'f' },
    { text: 'Homme', value: 'h' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar) {
  }


  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      id: [null],
      lastname: [''],
      firstname: [''],
      username: ['', Validators.required],
      genre: [''],
      password: ['', Validators.required],
      role: ['user']
    });

    console.log('[ngOnInit] Form initialized:', this.signUpForm.value);

    /*
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    if (idParam) {
      const id = Number(idParam);
      this.userService.getUser(id).subscribe(data => {
        this.user = data;

        this.signUpForm = this.fb.group({
          id: [this.user.id],
          lastname: [this.user.lastname],
          firstname: [this.user.firstname],
          username: [this.user.username],
          genre: [this.user.genre],
          password: [this.user.password],
        });
      });
    } else {

      this.signUpForm = this.fb.group({
        id: [null],
        lastname: [''],
        firstname: [''],
        username: ['', Validators.required],
        genre: [''],
        password: ['', Validators.required],
      });
    }  */
  }

  onSubmit() {

    console.log('[onSubmit] Form submit triggered');


    if (this.signUpForm.valid) {
      const formValue = this.signUpForm.value;

      formValue.role = "ROLE_USER";

      console.log('[onSubmit] Form is valid, value:', formValue);

      this.userService.addUser(formValue).subscribe({
        next: (data) => {
          console.log('[onSubmit] User added successfully:', data);
          this.snackbar.open('added！', '', { duration: 1500 });
          this.router.navigate(['/to-do-list']);
        },
        error: (error) => {
          console.error('[onSubmit] Error adding user:', error);
          this.snackbar.open('failed to add ' + (error.error || 'try later'), '', { duration: 3000 });
        }
      });
    } else {
      console.warn('[onSubmit] Form is invalid:', this.signUpForm.errors);
      this.snackbar.open('complete all', '', { duration: 1500 });
    }
  }
}
