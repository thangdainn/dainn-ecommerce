import { OrderDetail } from "./order-detail";

export class Order {
    id: number = 0;
    userId: number = 0;
    totalAmount: number = 0;
    // deliveryFee: number = 0;
    // discount: number = 0;
    customerName: string = '';
    customerPhone: string = '';
    shippingAddress: string = '';
    paymentMethod: string = '';
    details: OrderDetail[] = [];
}
