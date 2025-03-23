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
import { BrandManagementComponent } from './components/brand-management/brand-management.component';
import { SizeManagementComponent } from './components/size-management/size-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { CalendarModule } from 'primeng/calendar';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { CardModule } from 'primeng/card';
import { StepperModule } from 'primeng/stepper';
import { TimelineModule } from 'primeng/timeline';
import { DividerModule } from 'primeng/divider';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { ProductDetailAdComponent } from './components/product-detail-ad/product-detail-ad.component';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { ChipModule } from 'primeng/chip';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'roles', component: RoleManagementComponent },
      { path: 'categories', component: CategoryManagementComponent },
      { path: 'brands', component: BrandManagementComponent },
      { path: 'sizes', component: SizeManagementComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'orders/:id', component: OrderDetailComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'products/:code', component: ProductDetailAdComponent },
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
    CategoryManagementComponent,
    BrandManagementComponent,
    SizeManagementComponent,
    UserManagementComponent,
    OrderManagementComponent,
    OrderDetailComponent,
    ProductManagementComponent,
    ProductDetailAdComponent,
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
    MultiSelectModule,
    DialogModule,
    PasswordModule,
    CalendarModule,
    CardModule,
    StepperModule,
    TimelineModule,
    DividerModule,
    FieldsetModule,
    FileUploadModule,
    EditorModule,
    RadioButtonModule,
    TabViewModule,
    ChipModule,
    AccordionModule,
    InputNumberModule,
    ChartModule,
    SelectButtonModule
  ],
})
export class AdminModule {}
