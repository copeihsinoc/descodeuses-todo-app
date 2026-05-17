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

  // 🌟 核心：全域唯一的刷新機制（換成對法文語系/時區完全免疫的純數字版）
  refreshKPIs() {
    this.getTodos().subscribe((todos: Todo[]) => {
      // 1. 取得今天的年、月、日純數字
      const today = new Date();
      const tYear = today.getFullYear();
      const tMonth = today.getMonth();
      const tDate = today.getDate();

      // 2. 建立一個今天午夜的絕對時間戳（不帶時區干擾）
      const todayMidnight = new Date(tYear, tMonth, tDate).getTime();

      // 3. 計算 Today's Tasks (年月日必須完全跟今天一樣)
      const countToday = todos.filter(t => {
        if (!t.dueDate || t.completed) return false;
        const d = new Date(t.dueDate);
        return d.getFullYear() === tYear && d.getMonth() === tMonth && d.getDate() === tDate;
      }).length;

      // 4. 計算 Overdue (到期日的午夜小於今天的午夜)
      const countOverdue = todos.filter(t => {
        if (!t.dueDate || t.completed) return false;
        const d = new Date(t.dueDate);
        const dMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        return dMidnight < todayMidnight;
      }).length;

      // 5. 計算 Urgent (優先級為1，且未完成，且到期日大於或等於今天午夜)
      const countUrgent = todos.filter(t => {
        if (String(t.priority) !== '1' || t.completed) return false;
        if (!t.dueDate) return true; // 如果沒有設到期日，高優先級直接算 Urgent

        const d = new Date(t.dueDate);
        const dMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        return dMidnight >= todayMidnight; // 🌟 只要是今天或今天之後，就是 Urgent，絕不被誤殺！
      }).length;

      // 6. 統一廣播出去，這時兩邊收到的數字絕對百分之百相同！
      this.kpiSummarySubject.next([
        { label: "Today's Tasks", icon: 'today', count: countToday },
        { label: 'Urgent', icon: 'priority_high', count: countUrgent },
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
