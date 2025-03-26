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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerFormGroup!: FormGroup;
  emailIsExisted: boolean = false;
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
    this.registerFormGroup = this.formBuilder.group(
      {
        name: new FormControl('', [
          Validators.required,
          ShopValidators.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ]),
        phone: new FormControl('', [
          Validators.required,
          Validators.pattern(/^0\d{9}$/),
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
    if (this.emailIsExisted) {
      this.emailIsExisted = false;
    }
    if (this.email!.invalid) {
      this.email!.markAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService.checkEmail(this.email!.value).subscribe({
      next: (data) => {
        if (data) {
          this.emailIsExisted = true;
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
          this.emailIsExisted = true;
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
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService
      .register({
        name: this.name!.value,
        email: this.email!.value,
        phone: this.phone!.value,
        password: this.password!.value,
      })
      .subscribe({
        next: () => {
          this.showSuccess('Register successfully.');
        },
        error: (err) => {
          if (err.status === 400) {
            this.emailIsExisted = true;
          } else {
            this.showError('Register failed, please try again.');
          }
        },
        complete: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        }
      });
  }

  get name() {
    return this.registerFormGroup.get('name');
  }

  get email() {
    return this.registerFormGroup.get('email');
  }

  get phone() {
    return this.registerFormGroup.get('phone');
  }

  get password() {
    return this.registerFormGroup.get('password');
  }

  get rePassword() {
    return this.registerFormGroup.get('rePassword');
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
