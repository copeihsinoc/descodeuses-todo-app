import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  //KPI
  //KeyPerformanceIndicators
  //Indicateur de performances cles

  kpis = [
    {
      id:1,
      icon:'event',
      title: 'To do today',
      value: 0,
      bg:"!bg-blue-500",
    },
    {
      id:2,
      icon:'warning',
      title: 'Overdue',
      value: 0,
      bg:"!bg-red-500",
    },
    {
      id:3,
      icon:'priority_high',
      title: 'Urgent',
      value: 0,
      bg:"!bg-yellow-500",
    }
  ];

  todos: Todo[] = [];

  
  constructor(private todoService: TodoService){
  }

  ngOnInit(): void {
    this.fetchTodo();
  }

  fetchTodo(){
    //Communication asynchrone donc il faut s'inscrire pour avoir le retour
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data; 
      //creer 3 variables de type nombre
      //...
      let today = new Date(2025,5,10);

      let countUrgent = 0, countToday = 0, countLate = 0;
      //Urgentes: priority = 1 Et due date = Aujourd'hui
      //"==" n'est pas utilisable avec les objets Date
      //pour cela je convertis en string avec la fonction .toDateString()
      //afin de pouvoir utiliser "=="
      countUrgent = this.todos.filter(c=>
        c.priority == '1' &&
        new Date(c.dueDate).toDateString() == today.toDateString()).length;
      
      this.kpis[2].value = countUrgent;


      //variable = this.todos.filter(c=>c.priority && c.dueDate ).TAILLE_LISTE;

      //A faire aujourd'hui: due date = Aujourd'hui
      //En utilisant la boucle for pour travers la liste todos
      //Remplir la valriable count de countToday

      //2 syntaxes pour boucle for
      for(let item of this.todos ){
        if(new Date(item.dueDate).toDateString() == today.toDateString()){
          countToday = countToday + 1; //++;
        }
      }  
      this.kpis[0].value = countToday;
     

      //Tache en retard: due date < Aujourd'hui
      for(let i=0; i<this.todos.length; i++){
        if(new Date(this.todos[i].dueDate) < today){
          countLate = countLate + 1;
        }
        this.kpis[1].value = countLate;
      }
      


  });
}
}
