import { Product } from "./product";
import { Size } from "./size";

export class CartItem {
    product: Product;
    quantity: number;
    stock: number;
    size: Size;
    constructor(product: Product, quantity: number, stock: number, size: Size) {
        this.product = product;
        this.quantity = quantity;
        this.stock = stock;
        this.size = size;
    }
}
