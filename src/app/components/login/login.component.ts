declare var google: any;
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  private clientId: string =
    '871646200780-eu45o1bggee0k30hcv6u17b7gdco0ji9.apps.googleusercontent.com';

  isLoading: boolean = false;
  loginError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private activeRoute: ActivatedRoute
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
      password: new FormControl('', [Validators.required]),
    });
  }

  private handleGoogleLogin() {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => {
        this.authService.loginWithGoogle(response).subscribe({
          next: async (response) => {
            console.log('Login successful: ' + response);
            await firstValueFrom(
              this.cartService.handleCartLogin(
                this.getUserId(response.access_token)
              )
            );
            this.router.navigateByUrl((this.activeRoute.snapshot.queryParams['returnUrl']) as string || '/');
          },
          error: (err) => {
            console.log('Login failed: ' + err.message);
          },
        });
      },
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large', type: 'standard' }
    );
  }

  onSubmit() {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService
      .login({
        email: this.email?.value,
        password: this.password?.value,
        deviceInfo: '',
      })
      .subscribe({
        next: async (response) => {
          console.log('Login successful: ' + response);
          if (this.authService.roleSubject.value !== 'ROLE_USER') {
            this.isLoading = false;
            this.router.navigateByUrl('/admin');
            return;
          }
          await firstValueFrom(
            this.cartService.handleCartLogin(
              this.getUserId(response.access_token)
            )
          );
          this.isLoading = false;
          this.router.navigateByUrl((this.activeRoute.snapshot.queryParams['returnUrl']) as string || '/');
        },
        error: (err) => {
          this.loginError = err.error.detail;
          this.isLoading = false;
        },
      });
  }

  get email() {
    return this.loginFormGroup.get('email');
  }

  get password() {
    return this.loginFormGroup.get('password');
  }

  private getUserId(token: string): number {
    const jwtDecoded = this.authService.decodeJwt(token);
    return jwtDecoded.id;
  }
}
