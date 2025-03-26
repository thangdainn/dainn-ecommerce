import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User = new User();
  avatar: string = 'assets/images/person_4.jpg';
  gender: string = 'Male';
  dateOfBirth: Date = new Date('2003-01-01');
  uploadedFiles: any[] = [];
  maxFileSize: number = 1000000;
  allowedFileTypes: string[] = ['image/jpeg', 'image/png'];
  uploadUrl = environment.apiUrl + '/api/upload';
  isLoading: boolean = false;
  profileFormGroup!: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initFormGroups();
    this.getMyInfo();
  }

  initFormGroups() {
    this.profileFormGroup = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        ShopValidators.notOnlyWhitespace,
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^0\d{9}$/),
      ]),
    });
  }

  getMyInfo() {
    this.userService.getMyInfo().subscribe((data) => {
      this.user = data;
      this.profileFormGroup.patchValue({
        name: this.user.name,
        phone: this.user.phone,
      });
    });
  }

  onUpload(event: any) {
    this.isLoading = true;
    const url = event.originalEvent.body.url;
    this.user.avatar = url;
    this.isLoading = false;
  }

  onlyNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onSave() {
    if (this.profileFormGroup.invalid) {
      this.profileFormGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.user.name = this.name?.value;
    this.user.phone = this.phone?.value;

    console.log(this.user);
    
    this.userService.updateProfile(this.user).subscribe({
      next: (data) => {
        this.authService.avatarSubject.next(this.user.avatar);
        this.isLoading = false;
        this.showSuccess('Update successfully');
      },
      error: (err) => {
        this.isLoading = false;
        this.showError('Update failed');
      },
    });
  }

  get name() {
    return this.profileFormGroup.get('name');
  }

  get phone() {
    return this.profileFormGroup.get('phone');
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
