import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  fg!: FormGroup;
  isLoading: boolean = false;
  email: string = '';
  inValidPw: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initEmail();
    this.validateFormLogin();
  }

  initEmail() {
    this.authService.emailSubject.subscribe((data) => {
      this.email = data;
    });
  }

  private validateFormLogin() {
    this.fg = this.formBuilder.group(
      {
        oldPassword: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        rePassword: new FormControl('', [Validators.required]),
      },
      { validators: ShopValidators.passwordMisMatch }
    );
  }

  onCheckPassword(nextCallback: any) {
    if (this.oldPassword!.invalid) {
      this.oldPassword!.markAsTouched();
      return;
    }
    this.isLoading = true;
    this.inValidPw = false;
    this.authService
      .checkPassword(this.email, this.oldPassword!.value)
      .subscribe({
        next: (data) => {
          if (!data) {
            this.inValidPw = true;
            this.isLoading = false;
            return;
          }
          this.isLoading = false;
          nextCallback.emit();
        },
        error: (err) => {
          console.log('Check password failed: ' + err.message);
          this.isLoading = false;
        },
      });
  }

  onSubmit() {
    if (this.fg.invalid) {
      this.fg.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService
      .forgotPassword({
        email: this.email,
        password: this.password!.value,
      })
      .subscribe({
        next: () => {
          this.showSuccess('Password changed successfully');
        },
        error: (err) => {
          this.showError('Password changed failed');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  get oldPassword() {
    return this.fg.get('oldPassword');
  }

  get password() {
    return this.fg.get('password');
  }

  get rePassword() {
    return this.fg.get('rePassword');
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
