import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Role } from 'src/app/common/role';
import { RoleService } from 'src/app/services/role.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-role-management-action',
  templateUrl: './role-management-action.component.html',
  styleUrl: './role-management-action.component.css',
})
export class RoleManagementActionComponent implements OnInit {
  editFormGroup!: FormGroup;
  roleIsExisted: boolean = false;
  role: Role = new Role();

  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private roleService: RoleService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm();
    this.handleUpdateMode();
  }
  

  private validateForm() {
    this.editFormGroup = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', [
        Validators.required,
        ShopValidators.notOnlyWhitespace,
      ]),
      description: new FormControl('', [
        Validators.required,
        ShopValidators.notOnlyWhitespace,
      ]),
    });
  }

  isCreateMode(): boolean {
    return this.activeRoute.snapshot.url[1].path === 'create';
  }

  handleUpdateMode() {
    if (!this.isCreateMode()) {
      this.activeRoute.params.subscribe((params) => {
        const name = params['name'];
        this.roleService.getRoleByName(name).subscribe((data) => {
          this.role = data;
          this.editFormGroup.patchValue({
            id: data.id,
            name: data.name.split('_')[1],
            description: data.description,
          });
        });
      });
    }
  }

  get name() {
    return this.editFormGroup.get('name');
  }

  get description() {
    return this.editFormGroup.get('description');
  }

  get status() {
    return this.editFormGroup.get('status');
  }

  onSubmit() {
    if (this.editFormGroup.invalid) {
      this.editFormGroup.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    if (this.isCreateMode()) {
      this.createRole();
    } else {
      this.updateRole();
    }
  }

  createRole() {
    this.roleService.createRole(this.editFormGroup.value).subscribe({
      next: () => {
        this.showSuccess('Create role successfully');
        this.isLoading = false;
        this.editFormGroup.reset();
      },
      error: (err) => {
        console.log('Create role failed: ' + err.message);
        this.showError('Create role failed');
        this.isLoading = false;
      },
    });
  }

  updateRole() {
    this.roleService.updateRole(this.editFormGroup.value).subscribe({
      next: () => {
        this.showSuccess('Update role successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Update role failed: ' + err.message);
        this.showError('Update role failed');
        this.isLoading = false;
      },
    });
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
