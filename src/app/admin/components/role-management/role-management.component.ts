import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Role } from 'src/app/common/role';
import { RoleService } from 'src/app/services/role.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css',
})
export class RoleManagementComponent implements OnInit {
  roles!: Role[];
  selectedRoles: Role[] = [];
  statuses!: any[];

  role: Role = new Role();
  roleDialog: boolean = false;
  editFormGroup!: FormGroup;
  roleIsExisted: boolean = false;
  roleStatus: boolean = true;

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
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getRolesPaginator();
    this.initStatuses();
    this.initValidateForm();
  }

  getRolesPaginator() {
    this.isLoading = true;
    this.roleService
      .getAllPaginate(
        this.page,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        this.status
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
    this.roles = data.data;
    this.page = data.page;
    this.size = data.size;
    this.totalElements = data.totalElements;
  }

  private initValidateForm() {
    this.editFormGroup = this.formBuilder.group({
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

  initStatuses() {
    this.statuses = [
      { label: 'Enable', value: 1 },
      { label: 'Disable', value: 0 },
    ];
  }

  filterStatus(status: number) {
    this.status = status;
    this.resetPage();
    this.getRolesPaginator();
  }

  handleSearch(event: any) {
    this.keyword = event.target.value;
    this.resetFilter();
    this.getRolesPaginator();
  }

  resetFilter() {
    this.page = 0;
    // this.size = 5;
    this.status = 1;
  }

  resetPage() {
    this.page = 0;
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.size = event.rows;
    this.getRolesPaginator();
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.deleteRoles();
      },
    });
  }

  deleteRoles() {
    this.isDeleting = true;
    let ids = this.selectedRoles.map((role) => role.id);
    this.roleService.deleteByIds(ids).subscribe({
      next: () => {
        this.roles = this.roles.filter(
          (role) => !this.selectedRoles.includes(role)
        );

        this.showSuccess('Delete successfully');
        this.selectedRoles = [];
        this.isDeleting = false;
        this.resetFilter();
        this.getRolesPaginator();
      },
      error: (err) => {
        console.log(err);

        this.showError('Error delete');
        this.isDeleting = false;
      },
    });
  }

  openNew() {
    this.isLoadingEdit = false;
    this.role = new Role();
    this.editFormGroup.reset();
    this.roleDialog = true;
  }

  openEdit(role: Role) {
    this.isLoadingEdit = false;
    this.role = { ...role };
    this.editFormGroup.patchValue({
      name: role.name,
      description: role.description,
    });
    this.roleStatus = this.revertStatus(role.status);
    this.roleDialog = true;
  }

  hideDialog() {
    this.roleDialog = false;
  }

  saveEdit() {
    if (this.editFormGroup.invalid) {
      this.editFormGroup.markAllAsTouched();
      return;
    }
    this.isLoadingEdit = true;
    this.role.name = this.role.name.split('_')[1];
    if (this.role.id === 0) {
      this.createRole(this.role);
    } else {
      this.role.status = this.unRevertStatus(this.roleStatus);
      this.updateRole(this.role);
    }
  }

  createRole(role: Role) {
    this.roleService.create(role).subscribe({
      next: () => {
        this.showSuccess('Create successfully');
        this.isLoadingEdit = false;
        this.editFormGroup.reset();
        this.resetFilter();
        this.getRolesPaginator();
        this.roleDialog = false;
        this.role = new Role();
      },
      error: (err) => {
        if (err.status === 400) {
          this.roleIsExisted = true;
          this.isLoadingEdit = false;
          return;
        }
        console.log('Create failed: ' + err.message);
        this.showError('Create failed');
        this.isLoadingEdit = false;
      },
    });
  }

  updateRole(role: Role) {
    this.roleService.update(role).subscribe({
      next: () => {
        this.showSuccess('Update successfully');
        this.isLoadingEdit = false;
        this.getRolesPaginator();
        this.roleDialog = false;
        this.role = new Role();
      },
      error: (err) => {
        if (err.status === 400) {
          this.roleIsExisted = true;
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

  get description() {
    return this.editFormGroup.get('description');
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
