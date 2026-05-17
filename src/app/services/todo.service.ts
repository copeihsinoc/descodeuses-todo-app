import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

//commande pour creer le fichier:
//ng g service todo

//Le service fait le lien entre le front et le back

//Il fait les operations CRUD: Create, Read, Update, Delete
@Injectable({            //create une service
  providedIn: 'root'
})
export class TodoService {

  //private apiURL = 'http://localhost:8080/api/action'; //'api/todos'

  private apiURL = environment.apiUrl + '/action'; //'api/todos'

  // 🌟 新增：全域共享的 KPI 狀態流 (初始值為 0)
  private kpiSummarySubject = new BehaviorSubject<any[]>([
    { label: "Today's Tasks", icon: 'today', count: 0 },
    { label: 'Urgent', icon: 'priority_high', count: 0 },
    { label: 'Overdue', icon: 'warning', count: 0 }
  ]);
  
  // 🌟 新增：暴露給外部組件訂閱的 Observable
  kpiSummary$ = this.kpiSummarySubject.asObservable();

  //HttpClient pour communiquer avec le API/Backend
  constructor(private http: HttpClient) { } 

  //C R U D 

  //C : Create
  addTodo(item : Todo) {
    //<Todo> : type de retour de l'appel HTTP
    return this.http.post<Todo>(this.apiURL, item); //envoyer un object
  }

  //R : Read
  //Fetch all (toute lia liste)
  /*getTodos() {
    //HTTP GET sans 2eme parametre parce que il y a pas de body
    return this.http.get<Todo[]>(this.apiURL); //(this.apiURL)ou on va envoyer
  }
*/
// 🌟 修改：在 R (Read) 裡面利用 tap 攔截數據，自動計算並廣播 KPI
  getTodos() {
    return this.http.get<Todo[]>(this.apiURL).pipe(
      tap((todos: Todo[]) => {
        this.calculateAndBroadcastKPIs(todos);
      })
    );
  }

  // 🌟 新增：統一的 KPI 計算邏輯 (結合妳 Sidebar 與 Dashboard 的精確比對)
  private calculateAndBroadcastKPIs(todos: Todo[]) {
    const todayStr = new Date().toDateString();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 1. Today's Tasks
    const countToday = todos.filter(t =>
      t.dueDate &&
      new Date(t.dueDate).toDateString() === todayStr &&
      !t.completed
    ).length;

    // 2. Overdue
    const countOverdue = todos.filter(t =>
      t.dueDate &&
      new Date(t.dueDate) < now &&
      !t.completed
    ).length;

    // 3. Urgent (排除 overdue)
    const countUrgent = todos.filter(t =>
      String(t.priority) === '1' &&
      !t.completed &&
      !(t.dueDate && new Date(t.dueDate) < now)
    ).length;

    // 將最新算好的數據發射出去
    this.kpiSummarySubject.next([
      { label: "Today's Tasks", icon: 'today', count: countToday },
      { label: 'Urgent', icon: 'priority_high', count: countUrgent },
      { label: 'Overdue', icon: 'warning', count: countOverdue }
    ]);
  }
  //R : Read
  //Fetch one item de todo par son Id
  getTodo(id : number) {
    return this.http.get<Todo>(this.apiURL +'/'+ id); //(this.apiURL +'/'+ id)(ou on va envoyer, sth )
  }

  //U : Update
  updateTodo(item : Todo) {
    return this.http.put<Todo>(this.apiURL +'/'+ item.id, item);
  }

  //D : Delete
  deleteTodo(id : number) {
    return this.http.delete(this.apiURL +'/'+ id);
  }

}
