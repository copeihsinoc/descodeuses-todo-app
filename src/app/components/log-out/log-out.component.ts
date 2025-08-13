import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-out',
  standalone: false,
  templateUrl: './log-out.component.html',
  styleUrl: './log-out.component.css'
})
export class LogOutComponent implements OnInit{

  
  constructor(private router: Router){}

  
  ngOnInit(): void {
    //removve user info
    sessionStorage.removeItem('authToken');

    setTimeout(()=> {
      this.router.navigate(['']);
    }, 1000);
  }
}
