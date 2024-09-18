declare var google: any;
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  private clientId: string =
    '871646200780-eu45o1bggee0k30hcv6u17b7gdco0ji9.apps.googleusercontent.com';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateFormLogin();
    this.handleGoogleLogin();
  }

  private validateFormLogin() {
    this.loginFormGroup = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  private handleGoogleLogin() {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => {
        this.authService.loginWithGoogle(response).subscribe({
          next: (response) => {
            console.log('Login successful: ' + response);
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.log('Login failed: ' + err.message);
          },
        });
      },
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large', type: 'icon' }
    );
  }

  onSubmit() {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }
    this.authService
      .login({
        email: this.email?.value,
        password: this.password?.value,
        deviceInfo: '',
      })
      .subscribe({
        next: (response) => {
          console.log('Login successful: ' + response);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log('Login failed: ' + err.message);
        },
      });
  }

  get email() {
    return this.loginFormGroup.get('email');
  }

  get password() {
    return this.loginFormGroup.get('password');
  }
}
