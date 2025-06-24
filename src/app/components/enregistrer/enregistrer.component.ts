import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-enregistrer',
  standalone: false,
  templateUrl: './enregistrer.component.html',
  styleUrl: './enregistrer.component.css'
})
export class EnregistrerComponent implements OnInit {
  signUpForm! : FormGroup;
  
  listGenre = [
    {text:'Femme', value:'f'},
    {text:'Homme', value:'h'}
  ];

  constructor(private fb: FormBuilder){

  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      userLastName: ['', [Validators.required]],
      userFirstName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      genreList:[''],
      password: ['', [Validators.required]],
    });
  }


  onSubmit(){
    if(this.signUpForm.valid){
      console.log(this.signUpForm.value);
    }
  }
}
