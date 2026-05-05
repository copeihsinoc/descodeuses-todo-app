import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  formGroup: FormGroup;

  users: User[] = [];
  userFilter: User[] = [];

  sortByName() {
    this.users.sort((a, b) => {
      let nameA = a.lastname ?? '';
      let nameB = b.lastname ?? '';
      return nameA.localeCompare(nameB)
    });
  }

  searchUser: string = '';

  selectedUsers: any[] = [];

  selectedUserId: number | null = null;



  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private http: HttpClient) {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]],
      textSearch: ['']
    })
  }
  ngOnInit(): void {
    this.fetchUsers();
  }
  fetchUsers() {
    this.userService.getUsers().subscribe((data) => {

      this.users = data;
      this.sortByName();
      this.userFilter = [...this.users];
      this.onSearch();
    });
  }
  /*
  onSearch(){
    this.users = [];

    for (let user of this.users){
      let search = this.textSearch.toLowerCase().trim();
      let firstname = user.firstname ?? '';
      let lastname = user.lastname ?? '';

      if(firstname.toLowerCase().startsWith(search) ||
        lastname.toLowerCase().startsWith(search)) {
          this.users.push(user);
        }
    }
  }
  */

  onSearch() {
    const search = (this.formGroup.get('textSearch')?.value || '').toLowerCase().trim();
    if (!search) {
      this.users = [...this.userFilter]; // 沒有輸入就還原
      return;
    }
    this.users = this.userFilter.filter(user =>
    (user.firstname?.toLowerCase().includes(search) ||
      user.lastname?.toLowerCase().includes(search))
    );
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
  if (this.selectedUsers.length === 0) return;

  const idsToDelete = this.selectedUsers.map(u => u.id);

  // 🔥 加在這裡（發 request 前）
  console.log('TOKEN =', sessionStorage.getItem('authToken'));

  // 1. UI 先更新
  this.users = this.users.filter(u => !idsToDelete.includes(u.id));
  this.userFilter = this.userFilter.filter(u => !idsToDelete.includes(u.id));

  // 2. call API
  this.userService.deleteUsers(idsToDelete).subscribe({
    next: () => {
      this.snackBar.open('Successfully deleted!', '', { duration: 1200 });
    },
    error: (err) => {
      console.error('Delete failed!', err);
      this.fetchUsers();
    }
  });

  this.selectedUsers = [];
}
  addUser() {
    this.selectedUserId = 0;
  }


  openUserDetail(id: number) {
    this.selectedUserId = id;
    //this.fetchUsers();
  }

  onCloseDetail() {
    this.selectedUserId = null;

    // wait angular clear input then stable UI
    setTimeout(() => { }, 50);
    this.fetchUsers();
  }

  stopClick(event: MouseEvent) {
    event.stopPropagation();
  }
}


