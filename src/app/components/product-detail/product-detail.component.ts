import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { firstValueFrom } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Size } from 'src/app/common/size';
import { ProductSize } from 'src/app/common/product-size';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/common/cart';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product = new Product();
  images: string[] = [];
  userId: number = 0;

  productSizes: ProductSize[] = [];

  totalQuantity: number = 0;
  quantity: number = 1;

  selectedSize: number = 0;
  sizeName: string = '';

  customOptions: OwlOptions = {
    // animateOut: 'fadeOut',
    // animateIn: 'fadeIn',
    autoplay: false,
    autoplayHoverPause: true,
    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    autoHeight: false,
    items: 1,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
  };

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private messageService: MessageService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.authService.userIdSubject.subscribe((userId) => {
      this.userId = userId;
    });
    this.handleProductDetails().then((r) => r);
  }

  async handleProductDetails() {
    try {
      const productIdParam = this.activeRoute.snapshot.paramMap.get('code');
      const productCode: string =
        productIdParam !== null ? productIdParam : 'none';
      this.productService
        .getProductSizeByCode(productCode)
        .subscribe((data) => {
          this.productSizes = data;
          this.totalQuantity = this.productSizes.reduce(
            (acc, size) => acc + size.quantity,
            0
          );
        });

      this.product = await firstValueFrom(
        this.productService.getByCode(productCode)
      );
      this.images.push(this.product.image);
      this.product.imageUrls.forEach((image) => {
        this.images.push(image);
      });
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  }

  selectSize(size: any): void {
    if (size.quantity > 0) {
      this.selectedSize = size.sizeId;
      this.sizeName = size.sizeName;
      this.totalQuantity = size.quantity;
      this.quantity = 1;
    }
  }

  incQuantity(): void {
    if (this.quantity < this.totalQuantity) {
      this.quantity++;
    }
  }

  decQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity > 0 && newQuantity <= this.totalQuantity) {
      this.quantity = newQuantity;
    } else if (newQuantity > this.totalQuantity) {
      this.quantity = this.totalQuantity;
    } else {
      this.quantity = 1;
    }
  }

  addToCart() {
    console.log(this.userId);
    
    if (this.selectedSize > 0) {
      try {
        const cartItem = new Cart(
          null,
          this.product.id,
          this.selectedSize,
          this.quantity,
          this.userId,
          this.totalQuantity,
          this.product,
          new Size(this.selectedSize, this.sizeName)
        );
        this.cartService.addToCart(cartItem);
        this.showSuccess('Added to cart');
      } catch (error) {
        this.showError('Error adding to cart');
      }
    } else {
      this.showError('Please select size');
    }
  }

  async buyNow(): Promise<void> {
    if (this.selectedSize > 0) {
      try {
        const cartItem = new Cart(
          null,
          this.product.id,
          this.selectedSize,
          this.quantity,
          this.authService.userIdSubject.value,
          this.totalQuantity,
          this.product,
          new Size(this.selectedSize, this.sizeName)
        );
        await this.cartService.addToCart(cartItem);

        this.route.navigate(['/cart'], {
          state: { selectedItem: cartItem },
        });
      } catch (error) {
        this.showError('Error adding to cart');
      }
    } else {
      this.showError('Please select size');
    }
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
