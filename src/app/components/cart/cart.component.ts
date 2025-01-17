import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {Cart} from 'src/app/common/cart';
import {CartService} from 'src/app/services/cart.service';
import {SizeService} from 'src/app/services/size.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  totalPrice: number = 0;
  userId: number = 0;
  carts: Cart[] = [];
  selectedItems: Cart[] = [];

  constructor(
    private cartService: CartService,
    private sizeService: SizeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.carts = this.cartService.carts;
    // this.cartService.totalQuantity.subscribe(
    //   data => {
    //     this.totalQuantity = data;
    //   }
    // );

    // this.cartService.totalPrice.subscribe(
    //   data => {
    //     this.totalPrice = data;
    //   }
    // );

    for (let item of this.carts){
      this.sizeService.getQuantityByProductAndSize(item.productId, item.sizeId).subscribe(
        (data) => {
          item.maxQuantity = data.quantity;
        }
      );
    }
  }

  incQuantity(cartItem: Cart) {
    // debugger;
    if (cartItem.quantity + 1 <= cartItem.maxQuantity) {
      this.cartService.incQuantity(cartItem);
    }
  }

  decQuantity(cartItem: Cart) {
    if (cartItem.quantity - 1 > 0) {
      this.cartService.decQuantity(cartItem);
    }
  }

  removeItem(cartItem: Cart) {
    this.cartService.removeItems([cartItem]);
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
    this.router.navigate(['/checkout'], { state: { items : this.selectedItems } });
  }

  computeTotals() {
    this.totalPrice = this.selectedItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  }

  selectItem() {
    this.computeTotals();
  }

  selectAll() {
    this.computeTotals();
  }
}
