import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, from, Observable } from 'rxjs';
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
  // totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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

  getCartsFromLocal(): Cart[] {
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data != null) {
      this.carts = data;
    }
    return this.carts;
  }

  getCountCartItems(): Observable<number> {
    return this.httpClient.get<number>(this.baseUrl + '/count');
  }

  updateCartQuantity() {
    this.getCountCartItems().subscribe((count) =>
      this.totalQuantity.next(count)
    );
  }

  getCarts(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string
  ): Observable<GetResponseCart> {
    return this.httpClient.get<GetResponseCart>(
      `${this.baseUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  handleCartLogin(userId: number): Observable<Cart[]> {
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data != null) {
      this.storage.removeItem('cartItems');
      data.forEach((item: Cart) => {
        item.userId = userId;
      });
      return this.addToDB(data);
    }
    return from([]);
  }

  private getCartExist(cart: Cart) {
    return this.carts.find(
      (tempCartItem) =>
        tempCartItem.productId === cart.productId &&
        tempCartItem.sizeId === cart.sizeId
    );
  }

  private updateCartExist(item: Cart, cartExist: Cart): Cart {
    if (item.quantity + cartExist.quantity > cartExist.stock) {
      cartExist.quantity = cartExist.stock;
    } else {
      cartExist.quantity += item.quantity;
    }
    return cartExist;
  }

  async addToCart(cartItem: Cart) {
    if (cartItem.userId !== 0) {
      await firstValueFrom(this.addToDB([cartItem]));
      this.updateCartQuantity();
      return;
    }
    let cartExist = this.getCartExist(cartItem);
    if (cartExist) {
      cartExist = this.updateCartExist(cartItem, cartExist);
    } else {
      this.carts.push(cartItem);
    }
    console.log(this.carts);

    this.computeCartTotals();
  }

  addToDB(items: Cart[]): Observable<Cart[]> {
    return this.httpClient.post<Cart[]>(this.baseUrl, items);
  }

  updateToDB(cartItem: Cart): Observable<Cart> {
    return this.httpClient.put<Cart>(this.baseUrl, cartItem);
  }

  removeFromDB(ids: number[]): Observable<Cart> {
    return this.httpClient.delete<Cart>(this.baseUrl, { body: ids });
  }

  removeItemsInCache(cartItems: Cart[]) {
    cartItems.forEach((tempCartItem) => {
      const index = this.carts.findIndex(
        (cartItem) =>
          cartItem.productId === tempCartItem.productId &&
          cartItem.sizeId === tempCartItem.sizeId
      );
      if (index > -1) {
        this.carts.splice(index, 1);
        this.computeCartTotals();
      }
    });
  }

  removeItems(cartItems: Cart[]) {
    if (cartItems[0].userId !== 0) {
      let ids = cartItems.map((item) => item.id);
      this.removeFromDB(ids).subscribe();
    }
  }

  updateCartItemQuantity(cartItem: Cart, newQuantity: number) {
    if (newQuantity > 0 && newQuantity <= cartItem.stock) {
      cartItem.quantity = newQuantity;
    } else if (newQuantity > cartItem.stock) {
      cartItem.quantity = cartItem.stock;
    } else {
      cartItem.quantity = 1;
    }
    if (cartItem.userId !== 0) {
      this.updateToDB(cartItem).subscribe();
      return;
    }
    let cartExist = this.getCartExist(cartItem);
    if (cartExist) {
      cartExist.quantity = cartItem.quantity;
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    this.totalQuantity.next(this.carts.length);
    this.persistCartItems();
  }

  clearCart() {
    this.carts = [];
    this.computeCartTotals();
  }
}

interface GetResponseCart {
  data: Cart[],
  page: number,
  size: number,
  totalElements: number,
}
