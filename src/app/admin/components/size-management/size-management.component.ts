import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Brand } from 'src/app/common/brand';
import { Size } from 'src/app/common/size';
import { SizeService } from 'src/app/services/size.service';

@Component({
  selector: 'app-size-management',
  templateUrl: './size-management.component.html',
  styleUrl: './size-management.component.css'
})
export class SizeManagementComponent implements OnInit {
  sizes!: Size[];
  selectedSizes: Size[] = [];
  statuses!: any[];

  isLoading: boolean = false;
  isDeleting: boolean = false;

  visible: boolean = false;

  keyword: string = '';
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  sortBy: string = 'id';
  sortDir: string = 'asc';
  status: number = 1;

  constructor(
    private sizeService: SizeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getCatesPaginator();
    this.initStatuses();
  }

  getCatesPaginator() {
    this.isLoading = true;
    this.sizeService
      .getAllPaginate(
        this.page,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        this.status
      )
      .subscribe({
        next: (res) => {
          this.processResult(res), (this.isLoading = false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  processResult(data: any) {
    this.sizes = data.data;
    this.page = data.page;
    this.size = data.size;
    this.totalElements = data.totalElements;
  }

  getSeverity(status: number) {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'danger';
      default:
        return 'warning';
    }
  }

  initStatuses() {
    this.statuses = [
      { label: 'Enable', value: 1 },
      { label: 'Disable', value: 0 },
    ];
  }

  filterStatus(status: number) {
    this.status = status;
    this.getCatesPaginator();
  }

  handleSearch(event: any) {
    this.keyword = event.target.value;
    this.resetFilter();
    this.getCatesPaginator();
  }

  resetFilter() {
    this.page = 0;
    this.size = 5;
    this.status = 1;
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.size = event.rows;
    this.getCatesPaginator();
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.deleteSizes();
      },
    });
  }

  deleteSizes() {
    this.isDeleting = true;
    let ids = this.selectedSizes.map((cate) => cate.id);
    this.sizeService.deleteByIds(ids).subscribe({
      next: () => {
        this.sizes = this.sizes.filter(
          (size) => !this.selectedSizes.includes(size)
        );
        
        this.showSuccess('Deleted successfully');
        this.selectedSizes = [];
        this.isDeleting = false;
        this.resetFilter();
        this.getCatesPaginator();
      },
      error: (err) => {
        console.log(err);

        this.showError('Error deleting category');
        this.isDeleting = false;
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
