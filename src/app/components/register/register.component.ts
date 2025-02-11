import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerFormGroup!: FormGroup;
  emailIsExisted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.validateFormLogin();
  }

  private validateFormLogin() {
    this.registerFormGroup = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        ShopValidators.notOnlyWhitespace,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      rePassword: new FormControl('', [
        Validators.required,
      ]),
    }, { validators: ShopValidators.passwordMisMatch }
  );
  }

  onSubmit() {
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }
    this.authService
      .register({
        name: this.name!.value,
        email: this.email!.value,
        password: this.password!.value
      })
      .subscribe({
        next: () => {
          this.toastService.success('Register successful', 'Success', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right',
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          if (err.status === 400) {
            this.emailIsExisted = true;
          } else {
            console.log('Register failed: ' + err.message);
          }
        },
      });
  }

  get name() {
    return this.registerFormGroup.get('name');
  }

  get email() {
    return this.registerFormGroup.get('email');
  }

  get password() {
    return this.registerFormGroup.get('password');
  }

  get rePassword() {
    return this.registerFormGroup.get('rePassword');
  }
}
