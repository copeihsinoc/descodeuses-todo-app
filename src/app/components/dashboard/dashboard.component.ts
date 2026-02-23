import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  user!: User;

  // 遊戲欄位
  level = 0;
  energy = 0;
  fishCount = 0;
  toyCount = 0;
  heartCount = 0;

  // Feed Btn
  selectedItem: 'fish' | 'toy' | 'heart' = 'fish';

  //KPI
  //KeyPerformanceIndicators
  //Indicateur de performances cles

  kpis = [
    {
      id: 1,
      icon: 'event',
      title: 'Today',
      value: 0,
      bg: "!bg-blue-500",
    },
    {
      id: 2,
      icon: 'warning',
      title: 'Overdue',
      value: 0,
      bg: "!bg-red-500",
    },
    {
      id: 3,
      icon: 'priority_high',
      title: 'Urgent',
      value: 0,
      bg: "!bg-yellow-500",
    }
  ];

  todos: Todo[] = [];

  completedCount = 0;
  dailyRewardClaimed = false;  // 是否已領獎

  constructor(private todoService: TodoService, private userService: UserService,) { }

  ngOnInit(): void {
    this.loadUser();
    this.fetchTodo();
  }

  fetchTodo() {
    //Communication asynchrone donc il faut s'inscrire pour avoir le retour
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
      //creer 3 variables de type nombre
      //...
      let today = new Date();

      let countUrgent = 0, countToday = 0, countLate = 0;
      //Urgentes: priority = 1 Et due date = Aujourd'hui
      //"==" n'est pas utilisable avec les objets Date
      //pour cela je convertis en string avec la fonction .toDateString()
      //afin de pouvoir utiliser "=="
      countUrgent = this.todos.filter(c =>
        c.priority == '1' &&
        new Date(c.dueDate).toDateString() == today.toDateString()).length;

      this.kpis[2].value = countUrgent;


      //variable = this.todos.filter(c=>c.priority && c.dueDate ).TAILLE_LISTE;

      //A faire aujourd'hui: due date = Aujourd'hui
      //En utilisant la boucle for pour travers la liste todos
      //Remplir la valriable count de countToday

      //2 syntaxes pour boucle for
      for (let item of this.todos) {
        if (new Date(item.dueDate).toDateString() == today.toDateString()) {
          countToday = countToday + 1; //++;
        }
      }
      this.kpis[0].value = countToday;


      //Tache en retard: due date < Aujourd'hui
      for (let i = 0; i < this.todos.length; i++) {
        if (new Date(this.todos[i].dueDate) < today) {
          countLate = countLate + 1;
        }
        this.kpis[1].value = countLate;
      }

      // 計算今天完成任務數
      this.completedCount = this.todos.filter(
        t => new Date(t.dueDate).toDateString() === today.toDateString() && t.completed
      ).length;
    });
  }

  loadUser() {
    this.userService.getCurrentUser().subscribe({
      next: (res: User) => {
        this.user = res;

        this.level = res.level ?? 0;
        this.energy = res.energy ?? 0;
        this.fishCount = res.fishCount ?? 0;
        this.toyCount = res.toyCount ?? 0;
        this.heartCount = res.heartCount ?? 0;

        // 判斷今日是否已領每日獎勵
        this.dailyRewardClaimed = !!(res.dailyRewardDate && new Date(res.dailyRewardDate).toDateString() === new Date().toDateString());
      },
      error: err => console.error(err)
    });
  }

  selectItem(item: 'fish' | 'toy' | 'heart') {
    this.selectedItem = item;
  }

  // Feed 按鈕是否禁用
  isFeedDisabled(): boolean {
    const map = {
      fish: this.fishCount,
      toy: this.toyCount,
      heart: this.heartCount
    };
    return map[this.selectedItem] <= 0;
  }

  feed(item: 'fish' | 'toy' | 'heart') {
    if (this.isFeedDisabled()) return;

    let increment = 0;

    switch (item) {
      case 'fish':
        this.fishCount--;
        increment = 30;
        break;
      case 'toy':
        this.toyCount--;
        increment = 20;
        break;
      case 'heart':
        this.heartCount--;
        increment = 25;
        break;
    }

    this.energy += increment;

    if (this.energy >= 100) {
      this.level++;
      this.energy = this.energy - 100; // 超過 100 剩下的能量保留
    }

  }

  // 領每日獎勵
  claimDailyReward() {
    if (this.completedCount >= 3 && !this.dailyRewardClaimed) {
      this.userService.claimDailyReward().subscribe({
        next: (user) => {
          this.dailyRewardClaimed = true;
          this.user = user;
          // 更新前端數值
          this.level = user.level ?? 0;
          this.energy = user.energy ?? 0;
          this.fishCount = user.fishCount ?? 0;
          this.toyCount = user.toyCount ?? 0;
          this.heartCount = user.heartCount ?? 0;
        },
        error: (err) => console.error(err)
      });
    }
  }
}
