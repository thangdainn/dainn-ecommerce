import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  newPassFormGroup!: FormGroup;
  emailNotExisted: boolean = false;
  otp: string = '';
  verifyOtp: string = '';
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.validateFormLogin();
  }

  private validateFormLogin() {
    this.newPassFormGroup = this.formBuilder.group(
      {
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        rePassword: new FormControl('', [Validators.required]),
      },
      { validators: ShopValidators.passwordMisMatch }
    );
  }

  onCheckEmail(nextCallback: any) {
    if (this.emailNotExisted) {
      this.emailNotExisted = false;
    }
    if (this.email!.invalid) {
      this.email!.markAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService.checkEmail(this.email!.value).subscribe({
      next: (data) => {
        if (!data) {
          this.emailNotExisted = true;
          return;
        }
        this.authService.sendOtp(this.email!.value).subscribe({
          next: () => {
            nextCallback.emit();
          },
          error: (err) => {
            console.log('Send OTP failed: ' + err.message);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        if (err.status === 400) {
          this.emailNotExisted = true;
        }
        this.isLoading = false;
      }
    });
  }

  onVerifyOtp(nextCallback: any) {
    this.isLoading = true;
    this.authService.verifyOtp(this.email!.value, this.otp).subscribe({
      next: (data) => {
        if (!data) {
          this.verifyOtp = "OTP is invalid";
          return;
        }
        this.otp = '';
        nextCallback.emit();
        
      },
      error: (err) => {
        console.log('Verify OTP failed: ' + err.message);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.newPassFormGroup.invalid) {
      this.newPassFormGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService
      .forgotPassword({
        email: this.email!.value,
        password: this.password!.value,
      })
      .subscribe({
        next: () => {
          this.showSuccess('Password changed successfully');
        },
        error: (err) => {
          if (err.status === 400) {
            this.emailNotExisted = true;
          } else {
            console.log('Forgot password failed: ' + err.message);
          }
        },
        complete: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        }
      });
  }

  get email() {
    return this.newPassFormGroup.get('email');
  }

  get password() {
    return this.newPassFormGroup.get('password');
  }

  get rePassword() {
    return this.newPassFormGroup.get('rePassword');
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }
}
