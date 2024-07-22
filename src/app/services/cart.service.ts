import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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

  userId: number = 2;
  cartItems: CartItem[] = [];
  totalQuantity: Subject<number> = new Subject<number>();

  constructor(private httpClient: HttpClient) { }

  getCartByUserId(userId: number): Observable<Cart[]> {
    const cartUrl = `${this.baseUrl}/${userId}`;
    return this.httpClient.get<Cart[]>(cartUrl);
  }

  addToCart(cartItem: CartItem) {
    const existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.product.id === cartItem.product.id && tempCartItem.size.id === cartItem.size.id);

    if (existingCartItem){
      existingCartItem.quantity += cartItem.quantity;
    } else {
      this.cartItems.push(cartItem);
    }

    this.totalQuantity.next(this.cartItems.length);
    console.table(this.cartItems);
    console.log("total-quantity:", this.totalQuantity);
    
    
    
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
}
