import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
} from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  FilterService,
  SelectItem,
} from 'primeng/api';
import { Order } from 'src/app/common/order';
import { OrderService } from 'src/app/services/order.service';
import { OrderStatus } from 'src/app/shared/enums/order-status';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css',
})
export class OrderManagementComponent implements OnInit {
  orders!: Order[];
  order: Order = new Order();
  orderDialog: boolean = false;
  selectedOrders: Order[] = [];
  statuses: any[] = [];

  isLoadingEdit: boolean = false;
  isLoading: boolean = false;
  isConfirming: boolean = false;
  isCanceling: boolean = false;

  visible: boolean = false;

  keyword: string = '';
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  sortBy: string = 'orderDate';
  sortDir: string = 'desc';
  status: OrderStatus = OrderStatus.ALL;
  dateRange: Date[] = [];

  matchModeOptions: SelectItem[] = [];

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.getOrdersPaginator();
    this.initStatuses();
    this.initDateRangeFilter();
  }

  getOrdersPaginator() {
    this.isLoading = true;

    const fromDate = this.dateRange && this.dateRange[0] || null;
    const toDate = this.dateRange && this.dateRange[1] || null;

    const fromDateStr = fromDate ? this.formatDate(fromDate) : '';
    const toDateStr = toDate ? this.formatDate(toDate) : '';

    // const [fromDate, toDate] = this.dateRange;

    this.orderService
      .getAllPaginate(
        this.page,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        this.status,
        fromDateStr,
        toDateStr
      )
      .subscribe({
        next: (res) => {
          this.processResult(res);
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  processResult(data: any) {
    this.orders = data.data;
    this.page = data.page;
    this.size = data.size;
    this.totalElements = data.totalElements;
  }

  initDateRangeFilter() {
    const filterName = 'dateRangeFilter';
    this.filterService.register(
      filterName,
      (value: any, filter: Date[]): boolean => {
        if (!filter || filter.length === 0) return true; // Không lọc nếu dateRange rỗng
        const dateValue = new Date(value);
        const fromDate = filter[0] ? new Date(filter[0]) : null;
        const toDate = filter[1] ? new Date(filter[1]) : null;

        if (fromDate && toDate) {
          return dateValue >= fromDate && dateValue <= toDate;
        } else if (fromDate) {
          return dateValue >= fromDate;
        } else if (toDate) {
          return dateValue <= toDate;
        }
        return true;
      }
    );

    this.matchModeOptions = [{ label: 'Before - After', value: filterName }];
  }

  getSeverity(status: string) {
    switch (status) {
      case OrderStatus.PROCESSING:
        return 'info';
      case OrderStatus.TO_PAY:
        return 'warning';
      case OrderStatus.SHIPPING:
        return 'secondary';
      case OrderStatus.COMPLETED:
        return 'success';
      case OrderStatus.CANCELLED:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  initStatuses() {
    this.statuses = [
      { label: 'All', value: OrderStatus.ALL },
      { label: 'Processing', value: OrderStatus.PROCESSING },
      { label: 'To pay', value: OrderStatus.TO_PAY },
      { label: 'Shipping', value: OrderStatus.SHIPPING },
      { label: 'Completed', value: OrderStatus.COMPLETED },
      { label: 'Canceled', value: OrderStatus.CANCELLED },
    ];
  }

  // filterByDateRange() {
  //   this.getOrdersPaginator();
  // }

  private formatDate(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  }

  filterStatus(status: OrderStatus) {
    this.status = status;
    this.resetPage();
    this.getOrdersPaginator();
  }

  handleSearch(event: any) {
    this.keyword = event.target.value;
    this.resetFilter();
    this.getOrdersPaginator();
  }

  resetFilter() {
    this.page = 0;
    // this.size = 5;
    this.status = OrderStatus.ALL;
  }

  resetPage() {
    this.page = 0;
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.size = event.rows;
    this.getOrdersPaginator();
  }

  confirmOrder(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to confirm?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.isConfirming = true;
        this.updateOrderStatus(OrderStatus.SHIPPING);
      },
    });
  }

  cancelOrder(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to cancel?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.isCanceling = true;
        this.updateOrderStatus(OrderStatus.CANCELLED);
      },
    });
  }

  updateOrderStatus(status: OrderStatus) {
    const ids = this.selectedOrders.map((order) => order.id);
    this.orderService.updateStatuses(ids, status).subscribe({
      next: (response) => {
        if (status === OrderStatus.SHIPPING) {
          this.isConfirming = false;
        } else if (status === OrderStatus.CANCELLED) {
          this.isCanceling = false;
        }
        this.selectedOrders = [];
        this.resetFilter();
        this.getOrdersPaginator();
        this.showSuccess('Successfully');
      },
      error: (err) => {
        if (status === OrderStatus.SHIPPING) {
          this.isConfirming = false;
        } else if (status === OrderStatus.CANCELLED) {
          this.isCanceling = false;
        }
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
