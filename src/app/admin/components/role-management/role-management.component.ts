import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Role } from 'src/app/common/role';
import { RoleService } from 'src/app/services/role.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css',
})
export class RoleManagementComponent implements OnInit {
  roles!: Role[];
  selectedRoles: Role[] = [];
  statuses!: any[];

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
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getRolesPaginator();
    this.initStatuses();
  }

  getRolesPaginator() {
    this.isLoading = true;
    this.roleService
      .getRolesPaginate(
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
    this.getRolesPaginator();
  }

  handleSearch(event: any) {
    this.keyword = event.target.value;
    this.resetFilter();
    this.getRolesPaginator();
  }

  resetFilter() {
    this.page = 0;
    this.size = 5;
    this.status = 1;
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
    this.roleService.deleteRoles(ids).subscribe({
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