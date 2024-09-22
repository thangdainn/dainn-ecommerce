import { Product } from "./product";
import { Size } from "./size";

export class CartItem {
    product: Product;
    quantity: number;
    maxQuantity: number;
    size: Size;
    constructor(product: Product, quantity: number, maxQuantity: number, size: Size) {
        this.product = product;
        this.quantity = quantity;
        this.maxQuantity = maxQuantity;
        this.size = size;
    }
}
