import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/common/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.css'
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

  isLoading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.keyword = '';
    this.loadOrders();
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
  }

  loadOrders() {
    this.toggleLoading();
    this.orderService
      .getOfMePaginate(
        this.page - 1,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        ''
      )
      .subscribe({
        next: this.processResult(),
        error: (err) => console.error(err),
        complete: () => this.toggleLoading(),
      });
  }

  doSearch(value: string) {
    this.keyword = value;
    this.loadOrders();
  }

  handleStatusChange(status: string) {
    this.orders = [];
    this.toggleLoading();
    this.page = 1;
    this.selectedStatus = status;
    this.orderService
      .getOfMePaginate(
        this.page - 1,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        status
      )
      .subscribe({
        next: this.processResult(),
        error: (err) => console.error(err),
        complete: () => this.toggleLoading(),
      });
  }

  private processResult() {
    return (data: any) => {
      this.orders = data.data;
      this.page = data.page + 1;
      this.size = data.size;
      this.totalElements = data.totalElements;
    };
  }

  appendData() {
    this.toggleLoading();
    this.orderService
      .getOfMePaginate(
        this.page - 1,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        this.selectedStatus
      )
      .subscribe({
        next: (data) => {
          this.orders = [...this.orders, ...data.data];
          this.page = data.page + 1;
          this.size = data.size;
          this.totalElements = data.totalElements;
        },
        error: (err) => console.error(err),
        complete: () => this.toggleLoading(),
      });
  }

  onScroll() {
    if (this.orders.length < this.totalElements) {
      this.page++;
      this.appendData();
    }
  }
}
