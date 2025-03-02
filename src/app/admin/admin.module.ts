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
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { RoleActionComponent } from './components/role-action/role-action.component';
import { CategoryActionComponent } from './components/category-action/category-action.component';
import { BrandManagementComponent } from './components/brand-management/brand-management.component';
import { BrandActionComponent } from './components/brand-action/brand-action.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'roles', component: RoleManagementComponent },
      { path: 'roles/create', component: RoleActionComponent },
      { path: 'roles/edit/:name', component: RoleActionComponent },
      { path: 'categories', component: CategoryManagementComponent },
      { path: 'categories/create', component: CategoryActionComponent },
      { path: 'categories/edit/:id', component: CategoryActionComponent },
      { path: 'brands', component: BrandManagementComponent },
      { path: 'brands/create', component: BrandActionComponent },
      { path: 'brands/edit/:id', component: BrandActionComponent },
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
    RoleActionComponent,
    CategoryManagementComponent,
    CategoryActionComponent,
    BrandManagementComponent,
    BrandActionComponent
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
    InputTextareaModule,
    DropdownModule,
    IconFieldModule,
    InputIconModule,
    PaginatorModule,
  ],
})
export class AdminModule {}
