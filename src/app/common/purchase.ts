import { Order } from "./order";
import { OrderDetail } from "./order-detail";

export class Purchase {
    order: Order = new Order();
    orderDetails: OrderDetail[] = [];
}
