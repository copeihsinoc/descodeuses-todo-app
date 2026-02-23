import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user!: User;

  profileForm!: FormGroup;

  // 遊戲欄位
  level = 0;
  energy = 0;
  fishCount = 0;
  toyCount = 0;
  heartCount = 0;

  // Feed Btn
  selectedItem: 'fish' | 'toy' | 'heart' = 'fish';

  // level up Modal
  showLevelUpModal = false;
  newLevel = 0;

  //rewards
  rewards = { fish: 0, toy: 0, heart: 0 };

  // 密碼欄位控制
  showPassword: boolean = false; 
  


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: [''],
      password: [''],
      catPhoto: ['']
    });

    this.loadUserData();
  }


  loadUserData() {
    this.userService.getCurrentUser().subscribe({
      next: (res: User) => {
        this.user = res;
        this.profileForm.patchValue({
          username: res.username,
          password: '',
          catPhoto: res.catPhoto
        });

        // 遊戲欄位初始化
        this.level = res.level ?? 0;
        this.energy = res.energy ?? 0;
        this.fishCount = res.fishCount ?? 0;
        this.toyCount = res.toyCount ?? 0;
        this.heartCount = res.heartCount ?? 0;

      },
      error: err => console.error(err)
    });
  }

  // 切換明文/隱藏
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // 選擇要 Feed 的物品
  selectItem(item: 'fish' | 'toy' | 'heart') {
    this.selectedItem = item;
    console.log('Selected item:', this.selectedItem);
  }

  // Feed 按鈕 disable 控制
  isFeedDisabled(): boolean {
    switch (this.selectedItem) {
      case 'fish': return this.fishCount <= 0;
      case 'toy': return this.toyCount <= 0;
      case 'heart': return this.heartCount <= 0;
    }
    return true;
  }

  // Feed 按鈕
  feedSelectedItem() {
    console.log('Feeding:', this.selectedItem);
    this.feed(this.selectedItem);
  }

  // 計算總物品數量，用於按鈕 disable
  totalItems(): number {
    return this.fishCount + this.toyCount + this.heartCount;
  }

  // Feed 物品
  feed(item: string) {
    let increment = 0;
    switch (item) {
      case 'fish': if (this.fishCount <= 0) return; increment = 30; this.fishCount--; break;
      case 'toy': if (this.toyCount <= 0) return; increment = 20; this.toyCount--; break;
      case 'heart': if (this.heartCount <= 0) return; increment = 25; this.heartCount--; break;
    }

    this.energy += increment;
    if (this.energy >= 100) this.levelUp();
    if (this.energy > 100) this.energy = 100;

    // 同步前端 user 物件
    this.user.level = this.level;
    this.user.energy = this.energy;
    this.user.fishCount = this.fishCount;
    this.user.toyCount = this.toyCount;
    this.user.heartCount = this.heartCount;

    this.saveStats(); // 同步到後端
  }

  // 升級
  levelUp() {
    this.level++;
    this.energy = 0;
    this.newLevel = this.level;

    // 隨機生成獎勵 (0~3)
    this.rewards.fish = Math.floor(Math.random() * 4);
    this.rewards.toy = Math.floor(Math.random() * 4);
    this.rewards.heart = Math.floor(Math.random() * 4);

    // 更新前端數值
    this.fishCount += this.rewards.fish;
    this.toyCount += this.rewards.toy;
    this.heartCount += this.rewards.heart;

    // 更新 user 前端資料
    this.user.level = this.level;
    this.user.energy = this.energy;

    this.user.fishCount = this.fishCount;
    this.user.toyCount = this.toyCount;
    this.user.heartCount = this.heartCount;

    this.showLevelUpModal = true;

    this.saveStats();
  }

  closeLevelUpModal() {
    this.showLevelUpModal = false;
  }

  // 儲存遊戲欄位到後端
  saveStats() {
    const updatedUser: User = {
      ...this.user,
      level: this.level,
      energy: this.energy,
      fishCount: this.fishCount,
      toyCount: this.toyCount,
      heartCount: this.heartCount
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => console.log('User stats updated'),
      error: err => console.error(err)
    });
  }

  // 儲存 Profile（username / password）
  onSave() {
    const formValue = this.profileForm.value;

    const updatedUser: User = {
      ...this.user,
      username: formValue.username
    };

    // 只有使用者輸入新密碼才更新
    if (formValue.password && formValue.password.trim() !== '') {
      updatedUser.password = formValue.password;
    }

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        console.log('Profile saved');
        // 儲存後重置密碼欄位
        this.profileForm.get('password')?.reset();
      },
      error: err => console.error(err)
    });
  }


  // 取消 → 回復後端資料
  onCancel() {
    this.loadUserData();
  }

}