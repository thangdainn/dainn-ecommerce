import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InfiniteScrollDirective  } from 'ngx-infinite-scroll';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { PasswordModule } from 'primeng/password';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'account',
        children: [
          { path: 'profile', component: ProfileComponent },
          { path: 'password', component: ChangePasswordComponent },
        ],
      },
      { path: 'purchase', component: PurchaseOrderComponent },
      { path: '', redirectTo: 'account/profile', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  declarations: [
    UserComponent,
    ProfileComponent,
    ChangePasswordComponent,
    PurchaseOrderComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule.forChild(routes),
    RadioButtonModule,
    FileUploadModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    InfiniteScrollDirective,
    MenuModule,
    DividerModule,
    ReactiveFormsModule,
    StepperModule,
    PasswordModule
  ],
})
export class UserModule {}
