import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-enregistrer',
  standalone: false,
  templateUrl: './enregistrer.component.html',
  styleUrl: './enregistrer.component.css'
})
export class EnregistrerComponent implements OnInit {
  signUpForm!: FormGroup;

  listGenre = [
    { text: 'Femme', value: 'f' },
    { text: 'Homme', value: 'h' }
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {

  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      genre: [''],
      password: ['', [Validators.required]],
    });
  }


  onSubmit() {
    if (this.signUpForm.valid) {
      const user = this.signUpForm.value;

      console.log(this.signUpForm.value);

      this.userService.addUser(user).subscribe({
        next: () => {
          alert('succes！');
        },
        error: err => {
          console.error('fail to sign up', err);
        }
      });
    }
  }
}