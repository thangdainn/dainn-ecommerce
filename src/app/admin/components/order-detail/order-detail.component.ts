import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from 'src/app/common/order';
import { ActivatedRoute } from '@angular/router';
import { OrderStatus } from 'src/app/shared/enums/order-status';
import { MessageService } from 'primeng/api';

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  details?: string;
}

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  order: Order = new Order();
  statuses: any[] = [];
  selectedStatus: OrderStatus = OrderStatus.PROCESSING;

  active: number | undefined = 0;
  isLoadingStatus: boolean = false;

  events: EventItem[];

  constructor(
    private orderService: OrderService,
    private activeRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.events = [
      {
        status: 'Ordered',
        date: '15/10/2020 10:30',
        icon: 'pi pi-shopping-cart',
        color: '#9C27B0',
        image: 'game-controller.jpg',
        details: 'Order placed by customer',
      },
      {
        status: 'Processing',
        date: '15/10/2020 14:00',
        icon: 'pi pi-cog',
        color: '#673AB7',
        details: 'Order confirmed by admin',
      },
      {
        status: 'Shipped',
        date: '15/10/2020 16:15',
        icon: 'pi pi-shopping-cart',
        color: '#FF9800',
        details: 'Shipped via Express Logistics',
      },
      {
        status: 'Delivered',
        date: '16/10/2020 10:00',
        icon: 'pi pi-check',
        color: '#607D8B',
        details: 'Delivered to customer address',
      },
    ];
  }

  ngOnInit(): void {
    this.initStatuses();
    this.getOrderDetail();
  }

  getOrderDetail() {
    this.activeRoute.params.subscribe((params) => {
      const id = params['id'];
      this.orderService.getById(id).subscribe((data) => {
        this.order = data;
        this.selectedStatus = this.statuses
          .find((s) => s === this.order.status);
        this.initActiveTab(this.order.status);
      });
    });
  }

  initActiveTab(status: string) {
    if (status === OrderStatus.PROCESSING) {
      this.active = 0;
    }
    else if (status === OrderStatus.SHIPPING) {
      this.active = 1;
    }
    else if (status === OrderStatus.COMPLETED) {
      this.active = 2;
    } 
  }

  initStatuses() {
    this.statuses = [
      { label: 'Processing', value: OrderStatus.PROCESSING },
      { label: 'To pay', value: OrderStatus.TO_PAY },
      { label: 'Shipping', value: OrderStatus.SHIPPING },
      { label: 'Completed', value: OrderStatus.COMPLETED },
      { label: 'Canceled', value: OrderStatus.CANCELLED },
    ];
  }

  confirmOrder() {
    this.updateOrderStatus(OrderStatus.SHIPPING);
  }

  cancelOrder() {
    this.updateOrderStatus(OrderStatus.CANCELLED);
  }


  updateOrderStatus(status: OrderStatus) {
    this.isLoadingStatus = true;
    this.orderService.updateStatuses([this.order.id], status).subscribe({
      next: (response) => {
        this.selectedStatus = status;
        this.order.status = this.selectedStatus;
        this.isLoadingStatus = false;
        if (status === OrderStatus.SHIPPING) {
          this.active = 1;
        }
        this.showSuccess('Successfully');
      },
      error: (err) => {
        this.isLoadingStatus = false;
        this.showError('Failed');
      },
    });
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
