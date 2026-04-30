import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user!: any;
  todos: Todo[] = [];

  kpis = [
    { id: 1, icon: 'assets/today.png', title: 'TODAY', value: 0 },
    { id: 2, icon: 'assets/urgent.png', title: 'URGENT', value: 0 },
    { id: 3, icon: 'assets/overdue.png', title: 'OVERDUE', value: 0 }
  ];

  // level up Modal
  showLevelUpModal = false;

  //1.Create empty places
  newLevel = 0;
  rewards = { fish: 0, toy: 0, heart: 0 };

  // Feed Btn
  selectedItem: 'fish' | 'toy' | 'heart' = 'fish';

  constructor(private todoService: TodoService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUser();
    this.fetchTodo();
  }

  //using get → refresh on login, no storage needed
  //--------------------------------- Daily Messages ---------------------------------
  get questStatus() {
    if (!this.user) return { text: 'Loading... 🐱', canCollect: false };

    //----- 1.Greeting -----
    const hour = new Date().getHours();
    let timeGreeting = "";
    if (hour < 12) timeGreeting = 'Good Morning! ☕';
    else if (hour < 18) timeGreeting = 'Good Afternoon! ☀️';
    else timeGreeting = 'Good Evening! 🌙';

    //----- 2.Claim Daily Rewards -----
    switch (this.user.rewardStatus) {
      case 'CLAIMED':
        return {
          text: `${timeGreeting} I'm full for today, meow~ Let's go again tomorrow! ✨`,
          canCollect: false
        };

      case 'READY':
        return {
          text: `${timeGreeting} All done! Where are my treats, meow? 🎁`,
          canCollect: true
        };

      default:
        const count = this.user.todayCompletedCount || 0;
        const remaining = Math.max(0, 3 - count);

        if (count === 0) {
          // Login
          return {
            text: `${timeGreeting} I'm hungry, meow~ Do some tasks and feed me!`,
            canCollect: false
          };
        } else {
          // Daily Challenge
          return {
            text: `Keep going! Just ${remaining} more for a snack—you got this, meow! 🔥`,
            canCollect: false
          };
        }
    }
  }

  loadUser() {
    this.userService.getCurrentUser().subscribe(res => this.user = res);
  }

  //--------------------------------- KPIs ---------------------------------
  fetchTodo() {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;

      const todayStr = new Date().toDateString();
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // 1. Today
      this.kpis[0].value = this.todos.filter(t =>
        t.dueDate &&
        new Date(t.dueDate).toDateString() === todayStr &&
        !t.completed
      ).length;

      // 2. Urgent（✅ 修正：排除 overdue）
      this.kpis[1].value = this.todos.filter(t =>
        String(t.priority) === '1' &&
        !t.completed &&
        !(t.dueDate && new Date(t.dueDate) < now)
      ).length;

      // 3. Overdue
      this.kpis[2].value = this.todos.filter(t =>
        t.dueDate &&
        new Date(t.dueDate) < now &&
        !t.completed
      ).length;
    });
  }


  //--------------------------------- Claim Rewards ---------------------------------
  onFishClick() {
    if (this.questStatus.canCollect) {
      this.userService.claimDailyReward().subscribe((updatedUser: any) => {
        this.user = updatedUser;
        console.log('Daily fish collected!');
      });
    }
  }

  //--------------------------------- Feed Your Cat ---------------------------------
  selectItem(item: 'fish' | 'toy' | 'heart') { this.selectedItem = item; }

  isFeedDisabled(): boolean {
    const map = { 
      fish: this.user?.fishCount, 
      toy: this.user?.toyCount, 
      heart: this.user?.heartCount };
    return (map[this.selectedItem] || 0) <= 0;
  }

  feed(item: 'fish' | 'toy' | 'heart') {
    if (!this.user || this.isFeedDisabled()) return;

    const bonus = { fish: 30, toy: 20, heart: 25 };
    this.user.energy += bonus[item];

    // while feeding...
    if (item === 'fish') this.user.fishCount--;
    else if (item === 'toy') this.user.toyCount--;
    else if (item === 'heart') this.user.heartCount--;

    // 升級判斷
    if (this.user.energy >= 100) {
      this.levelUp(); // 呼叫專門處理升級的 function
    }

    this.userService.updateUser(this.user).subscribe();
  }

  // 參考 Profile 的 levelUp 邏輯
  levelUp() {
    this.user.level++;
    this.user.energy = this.user.energy >= 100 ? this.user.energy - 100 : 0;
    this.newLevel = this.user.level;

    // 生成隨機獎勵
    this.rewards.fish = Math.floor(Math.random() * 4);
    this.rewards.toy = Math.floor(Math.random() * 4);
    this.rewards.heart = Math.floor(Math.random() * 4);

    // 把獎勵加回 user 身上
    this.user.fishCount += this.rewards.fish;
    this.user.toyCount += this.rewards.toy;
    this.user.heartCount += this.rewards.heart;

    // 開啟 Modal (在 Dashboard 你原本是用 showRewardModal)
    this.showLevelUpModal = true;
  }

  closeLevelUpModal() {
    this.showLevelUpModal = false;
  }


}