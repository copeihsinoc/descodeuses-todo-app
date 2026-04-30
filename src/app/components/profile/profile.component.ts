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
  user:any;
  profileForm!: FormGroup;

  // 介面控制變數
  selectedItem: 'fish' | 'toy' | 'heart' = 'fish';
  showLevelUpModal = false;
  showPassword = false;

  // 升級獎勵暫存
  newLevel = 0;
  rewards = { fish: 0, toy: 0, heart: 0 };
  

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
      },
      error: err => console.error(err)
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  selectItem(item: 'fish' | 'toy' | 'heart') {
    this.selectedItem = item;
  }

  // 修正：統一使用 this.user 判斷
  isFeedDisabled(): boolean {
    if (!this.user) return true;
    const count = this.user[`${this.selectedItem}Count` as keyof User] as number;
    return (count || 0) <= 0;
  }

  feedSelectedItem() {
    this.feed(this.selectedItem);
  }

  // 修正：統一使用 this.user 判斷
  totalItems(): number {
    if (!this.user) return 0;
    return (this.user.fishCount || 0) + (this.user.toyCount || 0) + (this.user.heartCount || 0);
  }

  feed(item: 'fish' | 'toy' | 'heart') {
    if (!this.user || this.isFeedDisabled()) return;

    const bonus = { fish: 30, toy: 20, heart: 25 };
    
    // 1. 增加能量
    this.user.energy = (this.user.energy || 0) + bonus[item];

    // 2. 扣除物品
    if (item === 'fish') this.user.fishCount!--;
    else if (item === 'toy') this.user.toyCount!--;
    else if (item === 'heart') this.user.heartCount!--;

    // 3. 檢查升級
    if (this.user.energy >= 100) {
      this.levelUp();
    }

    this.saveStats(); 
  }

  levelUp() {
    this.user.level++;
    this.user.energy = this.user.energy >= 100 ? this.user.energy - 100 : 0;
    this.newLevel = this.user.level;

    // 隨機獎勵 (0~3)
    this.rewards.fish = Math.floor(Math.random() * 4);
    this.rewards.toy = Math.floor(Math.random() * 4);
    this.rewards.heart = Math.floor(Math.random() * 4);

    // 加入背包
    this.user.fishCount = (this.user.fishCount || 0) + this.rewards.fish;
    this.user.toyCount = (this.user.toyCount || 0) + this.rewards.toy;
    this.user.heartCount = (this.user.heartCount || 0) + this.rewards.heart;

    this.showLevelUpModal = true;
  }

  closeLevelUpModal() {
    this.showLevelUpModal = false;
  }

  saveStats() {
    if (!this.user) return;
    this.userService.updateUser(this.user).subscribe({
      next: () => console.log('Stats synced'),
      error: err => console.error(err)
    });
  }

  onSave() {
    if (!this.user) return;
    const formValue = this.profileForm.value;
    const updatedUser = { ...this.user, username: formValue.username };

    if (formValue.password?.trim()) {
      updatedUser.password = formValue.password;
    }

    this.userService.updateUser(updatedUser).subscribe({
      next: (res) => {
        this.user = res;
        this.profileForm.get('password')?.reset();
        console.log('Profile saved');
      }
    });
  }

  onCancel() {
    this.loadUserData();
  }
}