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

  currentMessage: string = '';// 用來存放暫時性的互動訊息

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
    // 1. 🌟 讓 Service 去發動抓取與計算
    this.todoService.refreshKPIs();

    // 2. 🌟 這裡只負責接收廣播，把數值填到畫面的陣列裡
    this.todoService.kpiSummary$.subscribe((summary: any[]) => {
      const todayData = summary.find(s => s.label === "Today's Tasks");
      const urgentData = summary.find(s => s.label === 'Urgent');
      const overdueData = summary.find(s => s.label === 'Overdue');

      if (todayData) this.kpis[0].value = todayData.count;
      if (urgentData) this.kpis[1].value = urgentData.count;
      if (overdueData) this.kpis[2].value = overdueData.count;
    });

    // 3. 畫面如果仍需要完整的 todos 陣列做其他渲染，單純拿資料即可
    this.todoService.getTodos().subscribe((data: Todo[]) => {
      this.todos = data;
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
      heart: this.user?.heartCount
    };
    return (map[this.selectedItem] || 0) <= 0;
  }

  feed(item: 'fish' | 'toy' | 'heart') {
    if (!this.user || this.isFeedDisabled()) return;

    // 設置餵食對話
    const feedMessages = ["Yummy! More, please~ 🐟", "Meow! I love this toy! 🎾", "Purrr... so much love! ❤️"];
    this.currentMessage = feedMessages[Math.floor(Math.random() * feedMessages.length)];

    // 3秒後恢復正常任務對話
    setTimeout(() => this.currentMessage = '', 3000);

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