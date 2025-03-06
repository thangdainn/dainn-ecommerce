import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShopComponent } from './components/shop/shop.component';
import { AboutComponent } from './components/about/about.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CategoryService } from './services/category.service';
import { BrandService } from './services/brand.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './components/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ContactComponent } from './components/contact/contact.component';
import { SizeService } from './services/size.service';
import { CartService } from './services/cart.service';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PaymentStatusComponent } from './components/payment-status/payment-status.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { authGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { guestGuard } from './guards/guest.guard';
import { AuthInterceptor } from './auth.interceptor';
import { PurchaseOrderComponent } from './components/purchase-order/purchase-order.component';
import { OrderService } from './services/order.service';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { InfiniteScrollDirective  } from 'ngx-infinite-scroll';
import { RegisterComponent } from './components/register/register.component';
import { ScrollTopModule } from 'primeng/scrolltop';
import { StepperModule } from 'primeng/stepper';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputOtpModule } from 'primeng/inputotp';
import { PasswordModule } from 'primeng/password';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { adminGuard } from './guards/admin.guard';
import { NotFoundComponent } from './components/error/not-found/not-found.component';
import { AccessDeniedComponent } from './components/error/access-denied/access-denied.component';
import { RoleService } from './services/role.service';
import { LocationService } from './services/location.service';
import { PaymentService } from './services/payment.service';
import { CardModule } from 'primeng/card';
import { UserService } from './services/user.service';


const routes: Routes = [
  { path: 'shop', component: ShopComponent },
  { path: 'search', component: ShopComponent },
  { path: 'product/:code', component: ProductDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'order-status', component: PaymentStatusComponent },
  { path: 'purchase', component: PurchaseOrderComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [adminGuard] },
  { path: '', component: HomeComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ShopComponent,
    AboutComponent,
    ProductDetailComponent,
    SearchComponent,
    ProductListComponent,
    ContactComponent,
    CartComponent,
    CheckoutComponent,
    PaymentStatusComponent,
    LoginComponent,
    LoginStatusComponent,
    PurchaseOrderComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    NotFoundComponent,
    AccessDeniedComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    CarouselModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    NgxSliderModule,
    ReactiveFormsModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    DataViewModule,
    DividerModule,
    InfiniteScrollDirective,
    ScrollTopModule,
    StepperModule,
    FloatLabelModule,
    InputOtpModule,
    PasswordModule,
    ToastModule,
    DropdownModule,
    InputTextModule,
    CardModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ProductService,
    CategoryService,
    BrandService,
    SizeService,
    CartService,
    OrderService,
    AuthService,
    RoleService,
    UserService,
    LocationService,
    PaymentService,
    MessageService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
