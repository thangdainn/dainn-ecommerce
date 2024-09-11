import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
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
import { CheckoutService } from './services/checkout.service';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { authGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { guestGuard } from './guards/guest.guard';

const routes: Routes = [
  { path: 'shop', component: ShopComponent },
  { path: 'search', component: ShopComponent },
  { path: 'product/:code', component: ProductDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'order-status', component: PaymentStatusComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: '', component: HomeComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
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
  ],
  providers: [
    ProductService,
    CategoryService,
    BrandService,
    SizeService,
    CartService,
    CheckoutService,
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
