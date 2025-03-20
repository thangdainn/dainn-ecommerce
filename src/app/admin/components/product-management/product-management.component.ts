import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Brand } from 'src/app/common/brand';
import { Category } from 'src/app/common/category';
import { Product } from 'src/app/common/product';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent implements OnInit {
  products!: Product[];
  product: Product = new Product();
  selectedProducts: Product[] = [];
  statuses: any[] = [];
  inventoryStatuses: any[] = [];

  categories: Category[] = [];
  selectedCates: Category[] = [];
  brands: Brand[] = [];
  selectedBrands: Brand[] = [];

  isLoading: boolean = false;
  isDeleting: boolean = false;
  isLoadingCategories: boolean = false;
  isLoadingBrands: boolean = false;

  visible: boolean = false;

  keyword: string = '';
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  sortBy: string = 'createdDate';
  sortDir: string = 'desc';
  status: number = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getProductsPaginator();
    this.initStatuses();
    this.initCategories();
    this.initBrands();
  }

  getProductsPaginator() {
    this.isLoading = true;
    const cateIds = this.selectedCates.map((cate) => cate.id);
    const brandIds = this.selectedBrands.map((brand) => brand.id);
    this.productService
      .getAllPaginate(
        this.page,
        this.size,
        this.sortBy,
        this.sortDir,
        this.keyword,
        cateIds,
        brandIds,
        this.status,
        0,
        0,
        false,
        true
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
    this.products = data.data;
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

  getInventorySeverity(stock: number) {
    if (stock > 5) {
      return 'success';
    } else if (stock <= 5 && stock > 0) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  getInventoryStatus(stock: number) {
    if (stock > 5) {
      return 'INSTOCK';
    } else if (stock <= 5 && stock > 0) {
      return 'LOWSTOCK';
    } else {
      return 'OUTOFSTOCK';
    }
  }

  initStatuses() {
    this.statuses = [
      { label: 'Enable', value: 1 },
      { label: 'Disable', value: 0 },
    ];
  }

  initCategories() {
    this.isLoadingCategories = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoadingCategories = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoadingCategories = false;
      },
    });
  }

  initBrands() {
    this.isLoadingBrands = true;
    this.brandService.getAll().subscribe({
      next: (data) => {
        this.brands = data;
        this.isLoadingBrands = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoadingBrands = false;
      },
    });
  }

  // filterByDateRange() {
  //   this.getProductsPaginator();
  // }

  filterStatus(status: number) {
    this.status = status;
    this.resetPage();
    this.getProductsPaginator();
  }

  handleSearch(event: any) {
    this.keyword = event.target.value;
    this.resetFilter();
    this.getProductsPaginator();
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.deleteProducts();
      },
    });
  }

  deleteProducts() {
    this.isDeleting = true;
    let ids = this.selectedProducts.map((product) => product.id);
    this.productService.deleteByIds(ids).subscribe({
      next: () => {
        this.showSuccess('Deleted successfully');
        this.selectedProducts = [];
        this.isDeleting = false;
        this.resetFilter();
        this.getProductsPaginator();
      },
      error: (err) => {
        console.log(err);

        this.showError('Error deleting');
        this.isDeleting = false;
      },
    });
  }

  resetFilter() {
    this.page = 0;
    // this.size = 5;
    this.status = 1;
  }

  resetPage() {
    this.page = 0;
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.size = event.rows;
    this.getProductsPaginator();
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
