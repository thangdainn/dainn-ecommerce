import {Component, OnInit} from '@angular/core';
import {CartItem} from 'src/app/common/cart-item';
import {CartService} from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 1;
  userId: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    );

    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    );
  }

  incQuantity(cartItem: CartItem) {
    if (cartItem.quantity + 1 <= cartItem.maxQuantity) {
      this.cartService.incQuantity(cartItem);
    }
  }

  decQuantity(cartItem: CartItem) {
    this.cartService.decQuantity(cartItem);
  }

  remove(cartItem: CartItem) {
    this.cartService.removeItem(cartItem);
  }

  updateCartItemQuantity(cartItem: CartItem, newQuantity: number) {
    if (typeof newQuantity !== 'number') {
      newQuantity = 1;
    }
    this.cartService.updateCartItemQuantity(cartItem, newQuantity);
  }
}
