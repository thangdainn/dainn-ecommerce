import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/common/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css'],
})
export class PurchaseOrderComponent implements OnInit {
  selectedStatus: string = '';
  orderStatus: { value: string; display: string }[] = [
    { value: '', display: 'All' },
    { value: 'SHIPPING', display: 'Shipping' },
    { value: 'TO_PAY', display: 'To Pay' },
    { value: 'PROCESSING', display: 'Processing' },
    { value: 'COMPLETED', display: 'Completed' },
    { value: 'CANCELLED', display: 'Cancelled' },
  ];

  orders: Order[] = [];
  page: number = 1;
  size: number = 5;
  totalElements: number = 0;
  sortBy: string = 'id';
  sortDir: string = 'desc';
  keyword: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.keyword = '';
    this.handleProductsPaginate();
  }

  handleProductsPaginate() {
    this.orderService
      .getOrdersPaginate(
        this.page - 1,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        ''
      )
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.orders = data.data;
      this.page = data.page + 1;
      this.size = data.size;
      this.totalElements = data.totalElements;
    };
  }

  handleStatusChange(status: string) {
    this.selectedStatus = status;
    this.orderService
      .getOrdersPaginate(
        this.page - 1,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        status
      )
      .subscribe(this.processResult());
  }

  doSearch(value: string) {
    this.keyword = value;
    this.handleProductsPaginate();
  }
}
