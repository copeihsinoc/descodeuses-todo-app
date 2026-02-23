import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';


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

  selectedUserId: number | null =null;



  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private http: HttpClient) {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]],
      textSearch: ['']
    })
  }
  ngOnInit(): void {
    this.fetchUsers();
  }
  fetchUsers(){
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
    if (this.selectedUsers.length === 1) {
      // 👉 單筆刪除
      const user = this.selectedUsers[0];
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.selectedUsers = [];
        },
        error: err => console.error('Delete failed', err)
      });
    } else if (this.selectedUsers.length > 1) {
      // 👉 批次刪除
      const ids = this.selectedUsers.map(u => u.id);
      this.userService.deleteUsers(ids).subscribe({
        next: () => {
          this.users = this.users.filter(u => !ids.includes(u.id));
          this.selectedUsers = [];
        },
        error: err => console.error('Batch delete failed', err)
      });
    }
  }

  addUser() {
    this.selectedUserId = 0;
    }
  

  openUserDetail(id:number){
    this.selectedUserId = id;
    this.fetchUsers();
  }

  onCloseDetail(){
    this.selectedUserId = null;

    // wait angular clear input then stable UI
    setTimeout(() => {}, 50);
  }

  stopClick(event: MouseEvent) {
  event.stopPropagation();
}
}


