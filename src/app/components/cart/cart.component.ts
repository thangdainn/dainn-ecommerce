import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from 'src/app/common/cart';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { catchError, firstValueFrom, from, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  totalPrice: number = 0;
  userId: number = 0;
  carts: Cart[] = [];
  selectedItems: Cart[] = [];

  page: number = 1;
  size: number = 5;
  totalElements: number = 0;
  sortBy: string = 'modifiedDate';
  sortDir: string = 'desc';

  isLoading = false;
  loading = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.authService.isAuthenticatedSubject.subscribe((data) => {
      this.toggleLoading();
      if (data) {
        this.cartService
          .getCarts(this.page - 1, this.size, this.sortBy, this.sortDir)
          .subscribe({
            next: this.processResult(),
            error: (err) => console.error(err),
            complete: () => this.toggleLoading(),
          });
      } else {
        this.carts = this.cartService.carts;
        for (let item of this.carts) {
          this.productService
            .getStockByProductAndSize(item.productId, item.sizeId)
            .subscribe((data) => {
              item.stock = data.quantity;
            });
        }
        this.toggleLoading();
      }
    });
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
  }

  private processResult() {
    return (data: any) => {
      this.carts = data.data;
      this.page = data.page + 1;
      this.size = data.size;
      this.totalElements = data.totalElements;
    };
  }

  incQuantity(cartItem: Cart) {
    if (cartItem.quantity + 1 > cartItem.stock) {
      return;
    }

    cartItem.quantity++;
    if (cartItem.userId !== 0) {
      this.cartService.updateToDB(cartItem).subscribe();
      return;
    }
    this.cartService.computeCartTotals();
  }

  decQuantity(cartItem: Cart) {
    if (cartItem.quantity - 1 <= 0) {
      return;
    }

    cartItem.quantity--;
    if (cartItem.userId !== 0) {
      this.cartService.updateToDB(cartItem).subscribe();
      return;
    }
    this.cartService.computeCartTotals();
  }

  removeItem(cartItem: Cart) {
    if (cartItem.userId !== 0) {
      this.cartService.removeFromDB([cartItem.id]).subscribe();
      const index = this.carts.findIndex((item) => item.id === cartItem.id);
      if (index > -1) {
        this.carts.splice(index, 1);
      }
      this.cartService.totalQuantity.next(
        this.cartService.totalQuantity.value - 1
      );
      return;
    }
    this.cartService.removeItemsInCache([cartItem]);
  }

  async handleRemoveItems() {
    this.toggleLoading();
    await firstValueFrom(this.removeItems());
    this.toggleLoading();
  }


  removeItems(): Observable<Cart[]> {
    if (this.authService.isAuthenticatedSubject.value) {
      let ids = this.selectedItems.map((item) => item.id);
      return this.cartService.removeFromDB(ids).pipe(
        map(() => {
          this.carts = this.carts.filter(
            cartItem => !this.selectedItems.some(item => item.id === cartItem.id)
          );
  
          this.cartService.totalQuantity.next(
            this.cartService.totalQuantity.value - this.selectedItems.length
          );
  
          this.selectedItems = [];
          return this.carts;
        }),
        catchError(error => {
          console.error('Error removing items', error);
          return of(this.carts);
        })
      );
    }
    this.cartService.removeItemsInCache(this.selectedItems);
    return of(this.carts);
  }

  updateCartItemQuantity(cartItem: Cart, newQuantity: number) {
    if (typeof newQuantity !== 'number') {
      newQuantity = 1;
    }
    this.cartService.updateCartItemQuantity(cartItem, newQuantity);
  }

  proceedToCheckout() {
    console.log(this.selectedItems);
    if (this.selectedItems.length === 0) {
      alert('Please select at least one item to proceed to checkout');
      return;
    }
    this.router.navigate(['/checkout'], {
      state: { items: this.selectedItems },
    });
  }

  computeTotals() {
    this.totalPrice = this.selectedItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  }

  selectItem() {
    this.computeTotals();
  }

  selectAll() {
    this.computeTotals();
  }

  appendData() {
    this.toggleLoading();
    this.cartService
      .getCarts(this.page - 1, this.size, this.sortBy, this.sortDir)
      .subscribe({
        next: (data) => {
          this.carts = [...this.carts, ...data.data];
          this.page = data.page + 1;
          this.size = data.size;
          this.totalElements = data.totalElements;
        },
        error: (err) => console.error(err),
        complete: () => this.toggleLoading(),
      });
  }

  onScroll() {
    if (this.carts.length < this.totalElements) {
      this.page++;
      this.appendData();
    }
  }
}
