import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Role } from 'src/app/common/role';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css',
})
export class RoleManagementComponent implements OnInit {
  roles!: Role[];
  selectedRoles: Role[] = [];
  clonedProducts: { [s: string]: Role } = {};

  isLoading: boolean = false;
  isDeleting: boolean = false;

  visible: boolean = false;
  

  constructor(
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.isLoading = true;
    this.roleService.getAllRoles().subscribe((data) => {
      this.roles = data;
      this.isLoading = false;
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

  editRole(role: Role) {
    console.log(role);
  }

  deleteRoles() {
    this.isDeleting = true;
    let ids = this.selectedRoles.map((role) => role.id);
    this.roleService.deleteRoles(ids).subscribe({
      next: () => {
        this.roles = this.roles.filter(
          (role) => !this.selectedRoles.includes(role)
        );
        this.showSuccess('Role(s) deleted successfully');
        this.selectedRoles = [];
        this.isDeleting = false;
      },
      error: (err) => {
        console.log(err);
        
        this.showError('Error deleting role(s)');
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
