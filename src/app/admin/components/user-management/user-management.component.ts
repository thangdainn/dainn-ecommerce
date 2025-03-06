import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Role } from 'src/app/common/role';
import { User } from 'src/app/common/user';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  users!: User[];
  selectedUsers: User[] = [];
  statuses!: any[];

  roles!: Role[];
  selectedRoles: Role[] = [];

  providers!: object[];
  selectedProviders: object[] = [];

  user: User = new User();
  userDialog: boolean = false;
  editFormGroup!: FormGroup;
  userIsExisted: boolean = false;
  userStatus: boolean = true;

  isLoadingEdit: boolean = false;
  isLoading: boolean = false;
  isDeleting: boolean = false;

  visible: boolean = false;

  keyword: string = '';
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  sortBy: string = 'id';
  sortDir: string = 'asc';
  status: number = 1;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getUsersPaginator();
    this.initRoles();
    this.initStatuses();
    this.initProviders();
    this.initValidateForm();
  }

  initRoles() {
    this.roleService.getAll().subscribe({
      next: (res) => {
        this.roles = res.map((role) => {
          role.name = role.name.split('_')[1];
          return role;
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUsersPaginator() {
    this.isLoading = true;
    this.userService
      .getAllPaginate(
        this.page,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        this.status,
        this.selectedRoles.map((role) => role.id),
        this.selectedProviders
      )
      .subscribe({
        next: (res) => {
          this.processResult(res), (this.isLoading = false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  processResult(data: any) {
    this.users = data.data;
    this.page = data.page;
    this.size = data.size;
    this.totalElements = data.totalElements;
  }

  private initValidateForm() {
    this.editFormGroup = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      name: new FormControl('', [
        Validators.required,
        ShopValidators.notOnlyWhitespace,
      ]),
      role: new FormControl('', [Validators.required]),
    });
  }

  getSeverity(status: number) {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'danger';
      default:
        return 'warning';
    }
  }

  initProviders() {
    this.providers = [
      { label: 'Local', value: 'local' },
      { label: 'Google', value: 'google' },
    ];
  }

  initStatuses() {
    this.statuses = [
      { label: 'Enable', value: 1 },
      { label: 'Disable', value: 0 },
    ];
  }

  filterByRoles() {
    this.resetPage();
    this.getUsersPaginator();
  }

  filterStatus(status: number) {
    this.status = status;
    this.resetPage();
    this.getUsersPaginator();
  }

  handleSearch(event: any) {
    this.keyword = event.target.value;
    this.resetFilter();
    this.getUsersPaginator();
  }

  resetFilter() {
    this.page = 0;
    this.size = 5;
    this.status = 1;
  }

  resetPage() {
    this.page = 0;
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.size = event.rows;
    this.getUsersPaginator();
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.deleteUsers();
      },
    });
  }

  deleteUsers() {
    this.isDeleting = true;
    let ids = this.selectedUsers.map((cate) => cate.id);
    this.userService.deleteByIds(ids).subscribe({
      next: () => {
        this.users = this.users.filter(
          (user) => !this.selectedUsers.includes(user)
        );

        this.showSuccess('Deleted successfully');
        this.selectedUsers = [];
        this.isDeleting = false;
        this.resetFilter();
        this.getUsersPaginator();
      },
      error: (err) => {
        console.log(err);

        this.showError('Error deleting');
        this.isDeleting = false;
      },
    });
  }

  openNew() {
    this.userIsExisted = false;
    this.isLoadingEdit = false;
    this.user = new User();
    this.editFormGroup.reset();
    this.userDialog = true;
  }

  openEdit(user: User) {
    this.userIsExisted = false;
    this.isLoadingEdit = false;
    this.user = { ...user };
    this.user.roleName = this.user.roleName.split('_')[1];

    const selectedRole = this.roles.find(
      (role) => role.name === this.user.roleName
    );

    this.editFormGroup.patchValue({
      name: user.name,
      email: user.email,
      password: 'dainnshop',
      role: selectedRole?.name,
    });

    this.userStatus = this.revertStatus(user.status);
    this.userDialog = true;
  }

  hideDialog() {
    this.userDialog = false;
  }

  saveEdit() {
    if (this.editFormGroup.invalid) {
      this.editFormGroup.markAllAsTouched();
      return;
    }
    this.isLoadingEdit = true;
    this.user.name = this.name?.value;
    this.user.email = this.email?.value;
    this.user.roleName = this.role?.value;
    this.user.provider = 'local';

    if (this.user.id === 0) {
      this.user.password = this.password?.value;

      console.log(this.user);

      this.createUser(this.user);
    } else {
      this.user.password = '';
      this.user.status = this.unRevertStatus(this.userStatus);
      console.log(this.user);

      this.updateUser(this.user);
    }
  }

  createUser(user: User) {
    this.userService.create(user).subscribe({
      next: () => {
        this.showSuccess('Create successfully');
        this.isLoadingEdit = false;
        this.editFormGroup.reset();
        this.resetFilter();
        this.getUsersPaginator();
        this.userDialog = false;
        this.user = new User();
      },
      error: (err) => {
        if (err.status === 400) {
          this.userIsExisted = true;
          this.isLoadingEdit = false;
          return;
        }
        console.log('Create failed: ' + err.message);
        this.showError('Create failed');
        this.isLoadingEdit = false;
      },
    });
  }

  updateUser(user: User): any {
    this.userService.update(user).subscribe({
      next: () => {
        this.showSuccess('Update successfully');
        this.isLoadingEdit = false;
        this.getUsersPaginator();
        this.userDialog = false;
        this.user = new User();
      },
      error: (err) => {
        if (err.status === 400) {
          this.userIsExisted = true;
          this.isLoadingEdit = false;
          return;
        }
        console.log('Update failed: ' + err.message);
        this.showError('Update failed');
        this.isLoadingEdit = false;
      },
    });
  }

  revertStatus(status: number): boolean {
    return status == 1;
  }

  unRevertStatus(status: boolean): number {
    return status ? 1 : 0;
  }

  get name() {
    return this.editFormGroup.get('name');
  }

  get email() {
    return this.editFormGroup.get('email');
  }

  get password() {
    return this.editFormGroup.get('password');
  }

  get role() {
    return this.editFormGroup.get('role');
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
