import {Component, OnInit} from '@angular/core';
import { Cart } from 'src/app/common/cart';
import {CartItem} from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import {CartService} from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { SizeService } from 'src/app/services/size.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  totalPrice: number = 0;
  totalQuantity: number = 1;
  userId: number = 0;
  carts: Cart[] = [];

  constructor(
    private cartService: CartService,
    private sizeService: SizeService,
  ) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.carts = this.cartService.carts;
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

  remove(cartItem: Cart) {
    this.cartService.removeItem(cartItem);
  }

  updateCartItemQuantity(cartItem: Cart, newQuantity: number) {
    if (typeof newQuantity !== 'number') {
      newQuantity = 1;
    }
    this.cartService.updateCartItemQuantity(cartItem, newQuantity);
  }
}
