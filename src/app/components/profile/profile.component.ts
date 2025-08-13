import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService, UserProfile } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user!: UserProfile;

  profileForm!: FormGroup;

  //editMode: boolean
  editMode = false;

  constructor(private fb: FormBuilder, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        const image = profile.image && !profile.image.includes('localhost')
          ?profile.image
          :'assets/user.png';

        //get profile from back
        this.user = {
          ...profile,
          image: profile.image || ''
        }

        this.profileForm = this.fb.group({
          username: [this.user.username, [Validators.required, Validators.minLength(3)]]
        });
      },
      error: (err) => {
        console.error('get user infos failed', err);

        // 失敗時給個預設 user，避免前端崩潰
        this.user = {
          username: 'guest',
          image: 'assets/user.png'
        };

        this.profileForm = this.fb.group({
          username: [this.user.username, [Validators.required, Validators.minLength(3)]]
        });
      }
    });
  }

  enableEdit(): void {
    this.editMode = true;
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      // 這邊可呼叫 API 更新資料，示範先直接更新前端狀態
      this.user.username = this.profileForm.value.username;
      this.editMode = false;

      // 例如呼叫 update API
      // this.profileService.updateProfile(this.user).subscribe(...);
    }
  }

  cancel(): void {
    this.profileForm.patchValue({ username: this.user.username });
    this.editMode = false;
  }
}