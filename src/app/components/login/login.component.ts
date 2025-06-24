import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//'@':decorator↓
//qui decore la classe component
//il vient juste avant la calsse

//standalone: false
//composant accessible via un module seulement
//oblgiatoire de le mettre dans 'declarations' du app.module.ts (Module)
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
//'implements' pour implementer une interface
//une classe peut implementer plusieurs interfaces
export class LoginComponent implements OnInit {
//'!' pour pouvoir initialiser la variable ultérieurement
  loginForm! : FormGroup;

  //j'utilise l'injection automatique de angular pour recuperer
  //un objet form builder qui va construire le formulaire
  //pour faire cela j'ajoute ce que j'ai besoin dans les parametres

  //'private' avant formBuilder pour pouvoir acceder a la variable 
  //en dehors du constructeur

  constructor(private formBuilder : FormBuilder, private router:Router){

  }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      //1er parametre : valeur initiale du champ
      //2eme parametre : liste de validators
      usermail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);

      if(this.loginForm.value.usermail == 'admin@test.com' &&
        this.loginForm.value.password == 'admin'){
          sessionStorage.setItem('isLoggedIn', 'true');
          this.router.navigateByUrl('/dashboard');
        }
    }
  }
}
