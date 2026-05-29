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
    { label: 'Urgent', icon: 'error', count: 0 },
    { label: 'Overdue', icon: 'warning', count: 0 }
  ]);

  // 🌟 新增：暴露給外部組件訂閱的 Observable
  kpiSummary$ = this.kpiSummarySubject.asObservable();


  //HttpClient pour communiquer avec le API/Backend
  constructor(private http: HttpClient) { }

  refreshKPIs() {
    this.getTodos().subscribe((todos: Todo[]) => {
      
      // 1. get today's ("Sun May 17 2026")
      const todayStr = new Date().toDateString();
      
      // 2. 取得今天午夜的時間（用來單純判斷是否過期）
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // --- 3. 公式 ---

      // 計算 TODAY
      const countToday = todos.filter(t => 
        t.dueDate && new Date(t.dueDate).toDateString() === todayStr && !t.completed
      ).length;

      // 計算 URGENT（ priority :'1'& incompleted）
      const countUrgent = todos.filter(t => 
        String(t.priority) === '1' && !t.completed
      ).length;

      // 計算 OVERDUE
      const countOverdue = todos.filter(t => 
        t.dueDate && new Date(t.dueDate) < now && !t.completed
      ).length;

      // 4. 
      this.kpiSummarySubject.next([
        { label: "Today's Tasks", icon: 'today', count: countToday },
        { label: 'Urgent', icon: 'error', count: countUrgent },
        { label: 'Overdue', icon: 'warning', count: countOverdue }
      ]);
    });
  }

  //C R U D 

  //C : Create
  /* addTodo(item : Todo) {
     //<Todo> : type de retour de l'appel HTTP
     return this.http.post<Todo>(this.apiURL, item); //envoyer un object
   }*/
  // C : Create (新增後自動刷新 KPIs)
  addTodo(item: Todo) {
    return this.http.post<Todo>(this.apiURL, item).pipe(
      tap(() => this.refreshKPIs())
    );
  }

  //R : Read
  //Fetch all (toute lia liste)
  getTodos() {
    //HTTP GET sans 2eme parametre parce que il y a pas de body
    return this.http.get<Todo[]>(this.apiURL); //(this.apiURL)ou on va envoyer
  }

  //R : Read
  //Fetch one item de todo par son Id
  getTodo(id: number) {
    return this.http.get<Todo>(this.apiURL + '/' + id); //(this.apiURL +'/'+ id)(ou on va envoyer, sth )
  }

  /*//U : Update
  updateTodo(item : Todo) {
    return this.http.put<Todo>(this.apiURL +'/'+ item.id, item);
  }*/
  // U : Update (修改狀態後自動刷新 KPIs)
  updateTodo(item: Todo) {
    return this.http.put<Todo>(this.apiURL + '/' + item.id, item).pipe(
      tap(() => this.refreshKPIs())
    );
  }

  /*//D : Delete
  deleteTodo(id : number) {
    return this.http.delete(this.apiURL +'/'+ id);
  }*/
  // D : Delete (刪除後自動刷新 KPIs)
  deleteTodo(id: number) {
    return this.http.delete(this.apiURL + '/' + id).pipe(
      tap(() => this.refreshKPIs())
    );
  }
}
