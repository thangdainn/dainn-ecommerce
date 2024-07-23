import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { Cart } from '../common/cart';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private baseUrl = 'http://localhost:8090/api/carts';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'Bearer ' + localStorage.getItem('token'),
    })
  };

  userId: number = 0;
  cartItems: CartItem[] = [];
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private httpClient: HttpClient) { }

  getCartByUserId(userId: number): Observable<Cart[]> {
    const cartUrl = `${this.baseUrl}/${userId}`;
    return this.httpClient.get<Cart[]>(cartUrl);
  }

  addToCart(cartItem: CartItem) {
    const existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.product.id === cartItem.product.id && tempCartItem.size.id === cartItem.size.id);
    
    if (existingCartItem){
      if (existingCartItem.quantity + cartItem.quantity <= existingCartItem.maxQuantity) {
        existingCartItem.quantity += cartItem.quantity;
      } else {
        existingCartItem.quantity = existingCartItem.maxQuantity;
      }
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();

    if (this.userId !== 0) {
       let cart: Cart = new Cart(0, cartItem.product.id, cartItem.quantity, cartItem.size.id, this.userId);
       this.httpClient.post<Cart>(this.baseUrl, cart, this.httpOptions)
            .subscribe({
              next: data => {
                console.log(data);
              },
              error: error => {
                console.error('There was an error!', error);
              }
            })
    }
  }

  incQuantity(cartItem: CartItem) {
    cartItem.quantity++;
    this.computeCartTotals();
  }

  decQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    this.computeCartTotals();
  }

  removeItem(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.product.id === cartItem.product.id 
                                                && tempCartItem.size.id === cartItem.size.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
    this.computeCartTotals();
  }

  updateCartItemQuantity(cartItem: CartItem, newQuantity: number) {
    if (newQuantity > 0 && newQuantity <= cartItem.maxQuantity) {
      cartItem.quantity = newQuantity;
    } else if (newQuantity > cartItem.maxQuantity) {
      cartItem.quantity = cartItem.maxQuantity;
    } else {
      cartItem.quantity = 1
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.product.price;
      totalQuantityValue ++;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
