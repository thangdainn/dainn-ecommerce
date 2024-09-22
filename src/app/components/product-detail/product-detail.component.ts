import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Product} from 'src/app/common/product';
import {ProductService} from 'src/app/services/product.service';
import {firstValueFrom} from 'rxjs';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {Size} from 'src/app/common/size';
import {SizeService} from 'src/app/services/size.service';
import {ProductSize} from 'src/app/common/product-size';
import {CartService} from 'src/app/services/cart.service';
import {Cart} from 'src/app/common/cart';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product = new Product();
  images: string[] = [];

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
    private sizeService: SizeService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.handleProductDetails().then(r => r);
  }

  async handleProductDetails() {
    try {
      const productIdParam = this.route.snapshot.paramMap.get('code');
      const productCode: string = productIdParam !== null ? productIdParam : 'none';
      this.sizeService.getProductSizeByCode(productCode).subscribe(data => {
        this.productSizes = data;
        this.totalQuantity = this.productSizes.reduce((acc, size) => acc + size.quantity, 0);
      });

      this.product = await firstValueFrom(
        this.productService.getProductByCode(productCode)
      );
      this.images.push(this.product.imgUrl);
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
    // const quantity = Number(newQuantity);
    if (newQuantity > 0 && newQuantity <= this.totalQuantity) {
      this.quantity = newQuantity;
    } else if (newQuantity > this.totalQuantity) {
      this.quantity = this.totalQuantity;
    } else {
      this.quantity = 1;
    }

  }

  async addToCart(): Promise<void> {
    if (this.selectedSize > 0) {
      try {
        let maxQuantity = 0;
        this.productSizes.forEach(ps => {
          if (ps.sizeId === this.selectedSize) {
            this.sizeName = ps.sizeName;
            maxQuantity = ps.quantity;
          }
        });
        const cartItem = new Cart(
          null,
          this.product.id,
          this.selectedSize,
          this.quantity,
          this.authService.userIdSubject.value,
          maxQuantity,
          this.product,
          new Size(this.selectedSize, this.sizeName)
        );
        await firstValueFrom(this.cartService.addToCart(cartItem));
        this.toastService.success('Added to cart', 'Success', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right',
        });
        this.cartService.computeCartTotals();
      } catch (error) {
        this.toastService.error('Error Adding to cart', 'Error', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right',
        });
      }
    } else {
      this.toastService.error('Please select size', 'Error', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
    }
  }

  buyNow(): void {
    // if (this.selectedSize > 0) {
    //   console.log('Buy now:', this.product.id, this.selectedSize, this.quantity);
    //   this.cartService.getCartByUserId(this.userId).subscribe(data => {
    //     console.log(data);
    //   }
    //   );
    // } else {
    //   console.log('Please select size');
    // }
  }
}
