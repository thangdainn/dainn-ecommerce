import { Product } from "./product";
import { Size } from "./size";

export class Cart {
    constructor(
        public id: any = null,
        public productId: number = 0,
        public sizeId: number = 0,
        public quantity: number = 0,
        public userId: number = 0,
        public maxQuantity: number = 0,
        public product: Product = new Product(),
        public size: Size = new Size()
    ) {}
}
