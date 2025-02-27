import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { MenuModule } from 'primeng/menu';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { RoleManagementActionComponent } from './components/role-management-action/role-management-action.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'roles', component: RoleManagementComponent },
      { path: 'roles/create', component: RoleManagementActionComponent },
      { path: 'roles/edit/:name', component: RoleManagementActionComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    AdminHeaderComponent,
    SidebarComponent,
    RoleManagementComponent,
    RoleManagementActionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MenuModule,
    AvatarModule,
    BadgeModule,
    ScrollPanelModule,
    TableModule,
    TagModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    InputSwitchModule,
    ButtonModule,
    ConfirmPopupModule,
    InputTextModule,
    InputTextareaModule
  ],
})
export class AdminModule {}
