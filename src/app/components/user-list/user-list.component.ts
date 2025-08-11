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
export class UserListComponent implements OnInit {

  formGroup: FormGroup;

  users: User[] = [];
  selectedUsers: any[] = [];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  //check user is selected or not
  checked(user: User): boolean {
    return this.selectedUsers.some(u => u.id === user.id);
  }

  //select user
  select(user: User) {
    if (this.checked(user)) {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    } else {
      this.selectedUsers.push(user);
    }
  }

  deleteUser() {
    this.users = this.users.filter(u => !this.selectedUsers.includes(u));
    this.selectedUsers = [];
  }


  AddUser() {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
    }
  }

}


