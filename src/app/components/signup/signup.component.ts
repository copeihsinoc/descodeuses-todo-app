import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {


  @Output() close = new EventEmitter<void>();

  // (Admin 新增 user)
  @Input() isAdminMode: boolean = false;

  private _userId: number | null = null;
  @Input() set userId(id: number | null | undefined) {
    this._userId = id ?? null;
    this.isNewUser = !this._userId || this._userId <= 0;

    if (!this.signUpForm) {
      this.initForm(!this.isNewUser);
    }

    if (this.isNewUser) {
      // ➕ 新增模式：密碼必填
      this.formLoaded = true; // 新增模式立立即可用
    } else {
      // ➕ 編輯模式：密碼非必填
      this.loadData(this._userId!);
    }
  }

  isNewUser = true;
  user: User | null = null;             // 要編輯的 user (單一)
  signUpForm!: FormGroup;
  formLoaded = false;

  genre = [
    { text: 'Woman', value: 'w' },
    { text: 'Man', value: 'm' }
  ];

  catImages = [
    'assets/cat1.png',
    'assets/cat2.png',
    'assets/cat3.png',
    'assets/cat4.png',
    'assets/cat5.png',
    'assets/cat6.png',
    'assets/cat7.png',
    'assets/cat8.png',
    'assets/cat9.png',
    'assets/cat10.png',
    'assets/cat11.png',
    'assets/cat12.png'
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar) {
  }


  ngOnInit(): void {
    if (!this.signUpForm) {
      this.initForm(!this.isNewUser);
    }
    this.formLoaded = true;
  }

  private initForm(isEditMode = false) {
    // set rules
    const passwordValidators = [
      // at least 8 letters
      Validators.minLength(8),
      // includes：1 LETTER、1 letter、1 number、1 symbol
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ];

    // if EditMode password:Required
    if (!isEditMode) {
      passwordValidators.unshift(Validators.required);
    }

    this.signUpForm = this.fb.group({
      id: [null],
      lastname: [''],
      firstname: [''],
      username: ['', Validators.required],
      genre: [''],
      password: ['', passwordValidators], // 💡 rules
    });
  }

  /*-----load all infos-----*/
  private loadData(id: number) {
    this.formLoaded = false;
    this.userService.getUser(id).subscribe(user => {

      // 這裡存了 catPhoto
      this.user = user;

      this.signUpForm.patchValue({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        genre: user.genre,
        password: ''
      });
      this.formLoaded = true;
    });
  }

  onSave() {
    // 💡 程式防線：只要表單狀態無效（如密碼不合規）或資料還沒加載完，直接切斷，什麼都不執行！
    if (this.signUpForm.invalid || !this.formLoaded) {
      return;
    }

    const formValue = { ...this.signUpForm.value };

    //signup / add new user
    if (this.isNewUser) {

      //註冊時自動分配一張貓咪照片
      const randomCat = this.catImages[Math.floor(Math.random() * this.catImages.length)];

      // 將 catPhoto 加到 user object
      const newUser: User = {
        ...formValue,

        catPhoto: randomCat,

        //註冊帳號 初始值 0
        level: 0,
        energy: 0,
        fishCount: 0,
        toyCount: 0,
        heartCount: 0
      };

      // 新增時不帶 id
      delete formValue.id;

      this.userService.addUser(newUser).subscribe(() => {
        this.snackbar.open('Created!', '', { duration: 1000 });

        if (this.isAdminMode) {
          // ✅ Admin 新增完 -> return drawer
          this.close.emit();
          setTimeout(() => this.signUpForm.reset(), 50);
        } else {
          // ✅ User 註冊完 -> return login
          this.router.navigate(['/']);
        }
      });

    } else {
      //edit mode(Admin edit users)
      const updateUser: User = {
        id: formValue.id,
        firstname: formValue.firstname,
        lastname: formValue.lastname,
        username: formValue.username,
        genre: formValue.genre,
        password: formValue.password || '',

        // 新增 role
        role: this.user?.role || 'ROLE_USER',

        // 保留其他欄位，若 this.user 尚未載入可給預設值
        catPhoto: this.user?.catPhoto || '',
        level: this.user?.level || 0,
        energy: this.user?.energy || 0,
        fishCount: this.user?.fishCount || 0,
        toyCount: this.user?.toyCount || 0,
        heartCount: this.user?.heartCount || 0
      };

      //console.log('update payload:', updateUser);

      this.userService.updateUser(updateUser).subscribe(() => {
        this.snackbar.open('Updated!', '', { duration: 1000 });
        this.close.emit();
        setTimeout(() => this.signUpForm.reset(), 50);
      });
    }
  }

  onCancel() {
    this.signUpForm.reset();
    this.close.emit();
  }
}