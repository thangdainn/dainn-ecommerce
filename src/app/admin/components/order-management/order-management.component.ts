import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  FilterService,
  SelectItem,
  FilterMatchMode,
} from 'primeng/api';
import { Brand } from 'src/app/common/brand';
import { Order } from 'src/app/common/order';
import { OrderService } from 'src/app/services/order.service';
import { OrderStatus } from 'src/app/shared/enums/order-status';
import { ShopValidators } from 'src/app/validators/shop-validators';

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

  editFormGroup!: FormGroup;
  brandIsExisted: boolean = false;
  brandStatus: boolean = true;

  isLoadingEdit: boolean = false;
  isLoading: boolean = false;
  isDeleting: boolean = false;

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
    this.initValidateForm();
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

  private initValidateForm() {
    this.editFormGroup = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        ShopValidators.notOnlyWhitespace,
      ]),
      description: new FormControl('', [
        Validators.required,
        ShopValidators.notOnlyWhitespace,
      ]),
    });
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
    this.size = 5;
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

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.deleteBrands();
      },
    });
  }

  deleteBrands() {
    this.isDeleting = true;
    let ids = this.selectedOrders.map((order) => order.id);
    this.orderService.deleteByIds(ids).subscribe({
      next: () => {
        this.orders = this.orders.filter(
          (brand) => !this.selectedOrders.includes(brand)
        );

        this.showSuccess('Deleted successfully');
        this.selectedOrders = [];
        this.isDeleting = false;
        this.resetFilter();
        this.getOrdersPaginator();
      },
      error: (err) => {
        console.log(err);

        this.showError('Error deleting category');
        this.isDeleting = false;
      },
    });
  }

  openNew() {
    this.isLoadingEdit = false;
    this.order = new Order();
    this.editFormGroup.reset();
    this.orderDialog = true;
  }

  openEdit(order: Order) {
    this.isLoadingEdit = false;
    this.order = { ...order };
    // this.editFormGroup.patchValue({
    //   name: order.name,
    //   description: order.description,
    // });
    // this.orderStatus = this.revertStatus(order.status);
    this.orderDialog = true;
  }

  hideDialog() {
    this.orderDialog = false;
  }

  saveEdit() {
    if (this.editFormGroup.invalid) {
      this.editFormGroup.markAllAsTouched();
      return;
    }
    this.isLoadingEdit = true;
    // if (this.order.id === 0) {
    //   this.createBrand(this.order);
    // } else {
    // this.order.status = this.unRevertStatus(this.orderStatus);
    this.updateStatus(this.order);
    // }
  }

  updateStatus(order: Order): any {
    this.orderService.update(order).subscribe({
      next: () => {
        this.showSuccess('Update successfully');
        this.isLoadingEdit = false;
        this.getOrdersPaginator();
        this.orderDialog = false;
        this.order = new Order();
      },
      error: (err) => {
        if (err.status === 400) {
          this.brandIsExisted = true;
          this.isLoadingEdit = false;
          return;
        }
        console.log('Update failed: ' + err.message);
        this.showError('Update failed');
        this.isLoadingEdit = false;
      },
    });
  }

  get name() {
    return this.editFormGroup.get('name');
  }

  get description() {
    return this.editFormGroup.get('description');
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
