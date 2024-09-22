import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { Cart } from '../common/cart';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = environment.apiUrl + '/api/carts';
  storage: Storage = localStorage;
  carts: Cart[] = [];
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private httpClient: HttpClient) {
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data != null) {
      this.carts = data;
      this.computeCartTotals();
    }
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.carts));
  }

  getCarts(userId: number): Observable<Promise<Cart[]>> {
    const cartUrl = `${this.baseUrl}/${userId}`;
    return this.httpClient.get<Cart[]>(cartUrl, {}).pipe(
      map(async (response) => {
        for (let item of response) {
          let cartExist = this.getCartExist(item);
          if (cartExist) {
            cartExist = this.updateCartExist(item, cartExist);
            cartExist.userId = userId;
            let res = await firstValueFrom(this.updateToDB(cartExist));
            cartExist.id = res.id;
          } else {
            this.carts.push(item);
          }
        }
        this.addCartSessionToDB(userId, this.carts);
        this.computeCartTotals();
        return this.carts;
      })
    );
  }

  private getCartExist(cart: Cart) {
    return this.carts.find(
      (tempCartItem) =>
        tempCartItem.productId === cart.productId &&
        tempCartItem.sizeId === cart.sizeId
    );
  }

  private updateCartExist(item: Cart, cartExist: Cart): Cart {
    if (item.quantity + cartExist.quantity > cartExist.maxQuantity) {
      cartExist.quantity = cartExist.maxQuantity;
    } else {
      cartExist.quantity += item.quantity;
    }
    return cartExist;
  }

  private async addCartSessionToDB(userId: number, carts: Cart[]) {
    for (let cart of carts) {
      if (cart.id === 0 || cart.id == null) {
        {
          cart.userId = userId;
          let res = await firstValueFrom(this.addToDB(cart));
          cart.id = res.id;
        }
      }
    }
  }

  addToCart(cartItem: Cart): Observable<Cart> {
    return from(this.addToCartAsync(cartItem));
  }

  private async addToCartAsync(cartItem: Cart): Promise<Cart> {
    let cartExist = this.getCartExist(cartItem);
    if (cartExist) {
      cartExist = this.updateCartExist(cartItem, cartExist);
      if (cartItem.userId !== 0) {
        const updatedCart = await firstValueFrom(this.updateToDB(cartExist));
        cartExist.id = updatedCart.id;
        return cartExist;
      }
    } else {
      if (cartItem.userId !== 0) {
        const newCart = await firstValueFrom(this.addToDB(cartItem));
        cartItem.id = newCart.id;
        this.carts.push(cartItem);
        return cartItem;
      }
      this.carts.push(cartItem);
    }
    return {} as Cart;
  }

  addToDB(cartItem: Cart): Observable<Cart> {
    return this.httpClient.post<Cart>(this.baseUrl, cartItem);
  }

  updateToDB(cartItem: Cart): Observable<Cart> {
    return this.httpClient.put<Cart>(this.baseUrl, cartItem);
  }

  removeFromDB(ids: number[]): Observable<Cart> {
    return this.httpClient.delete<Cart>(this.baseUrl, { body: ids });
  }

  incQuantity(cartItem: Cart) {
    cartItem.quantity++;
    if (cartItem.userId !== 0) {
      this.updateToDB(cartItem).subscribe();
    }
    this.computeCartTotals();
  }

  decQuantity(cartItem: Cart) {
    cartItem.quantity--;
    if (cartItem.userId !== 0) {
      this.updateToDB(cartItem).subscribe();
    }
    this.computeCartTotals();
  }

  removeItem(cartItem: Cart) {
    const itemIndex = this.carts.findIndex(
      (tempCartItem) =>
        tempCartItem.productId === cartItem.productId &&
        tempCartItem.sizeId === cartItem.sizeId
    );
    if (itemIndex > -1) {
      this.carts.splice(itemIndex, 1);
      this.computeCartTotals();
    }
    if (cartItem.id !== 0) {
      this.removeFromDB([cartItem.id]).subscribe();
    }

    // this.computeCartTotals();
  }

  updateCartItemQuantity(cartItem: Cart, newQuantity: number) {
    if (newQuantity > 0 && newQuantity <= cartItem.maxQuantity) {
      cartItem.quantity = newQuantity;
    } else if (newQuantity > cartItem.maxQuantity) {
      cartItem.quantity = cartItem.maxQuantity;
    } else {
      cartItem.quantity = 1;
    }
    if (cartItem.userId !== 0) {
      this.httpClient.put<Cart>(this.baseUrl, cartItem, {});
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let item of this.carts) {
      totalPriceValue += item.quantity * item.product.price;
      totalQuantityValue++;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.persistCartItems();
  }

  clearCart() {
    this.carts = [];
    this.storage.removeItem('cartItems');
    this.computeCartTotals();
  }
}
