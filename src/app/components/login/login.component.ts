import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

  }

  get email() {
    return this.loginFormGroup.get('email');
  }

  get password() {
    return this.loginFormGroup.get('password');
  }

  onSubmit() {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }
    this.authService.login({
      email: this.email?.value, 
      password: this.password?.value, 
      deviceInfo: "laptop"}).subscribe(
      {
        next: response => {
          console.log('Login successful: ' + response);
          this.router.navigate(['/']);
        },
        error: err => {
          console.log('Login failed: ' + err.message);
        }
      }
    );

  }

}
