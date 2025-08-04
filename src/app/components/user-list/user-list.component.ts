import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/contact.service';


@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{
  
  formGroup : FormGroup;

  users : Contact[] = [];

  constructor(private fb: FormBuilder, private contactService : ContactService){
    this.formGroup = this.fb.group({
      title:['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.contactService.getContacts().subscribe((data)=>{
      this.users = data;
    })
  }



  onAddContact(){
    if(this.formGroup.valid){
      const formValue = this.formGroup.value;
    }
  }
}
