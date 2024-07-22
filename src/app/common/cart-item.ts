import { Product } from "./product";
import { Size } from "./size";

export class CartItem {
    id: number;
    product: Product;
    quantity: number;
    size: Size;
    constructor(id: number, product: Product, quantity: number, size: Size) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.size = size;
    }
}
