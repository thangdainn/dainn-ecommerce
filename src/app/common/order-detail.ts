import { CartItem } from "./cart-item";

export class OrderDetail {
    price: number = 0;
    quantity: number = 0;
    total: number = 0;
    productId: number = 0;
    productImg: string = '';
    sizeId: number = 0;

    constructor(cartItem: CartItem){
        this.price = cartItem.product.price;
        this.quantity = cartItem.quantity;
        this.total = this.price * this.quantity;
        this.productId = cartItem.product.id;
        this.productImg = cartItem.product.imgUrl;
        this.sizeId = cartItem.size.id;
    }
}
