import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{
  
  formGroup : FormGroup;

  users : User[] = [];

  constructor(private fb: FormBuilder, private userService : UserService){
    this.formGroup = this.fb.group({
      title:['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.userService.getUsers().subscribe((data)=>{
      this.users = data;
    })
  }



  onAddUser(){
    if(this.formGroup.valid){
      const formValue = this.formGroup.value;
    }
  }
}
