import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Category } from 'src/app/common/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent  implements OnInit {
  categories!: Category[];
  selectedCates: Category[] = [];
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
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getCatesPaginator();
    this.initStatuses();
  }

  getCatesPaginator() {
    this.isLoading = true;
    this.categoryService
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
    this.categories = data.data;
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
        this.deleteCates();
      },
    });
  }

  deleteCates() {
    this.isDeleting = true;
    let ids = this.selectedCates.map((cate) => cate.id);
    this.categoryService.deleteByIds(ids).subscribe({
      next: () => {
        this.categories = this.categories.filter(
          (cate) => !this.selectedCates.includes(cate)
        );
        
        this.showSuccess('Deleted successfully');
        this.selectedCates = [];
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
