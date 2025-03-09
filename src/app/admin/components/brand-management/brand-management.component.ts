import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Brand } from 'src/app/common/brand';
import { BrandService } from 'src/app/services/brand.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrl: './brand-management.component.css',
})
export class BrandManagementComponent implements OnInit {
  brands!: Brand[];
  brand: Brand = new Brand();
  brandDialog: boolean = false;
  selectedBrands: Brand[] = [];
  statuses!: any[];

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
  sortBy: string = 'id';
  sortDir: string = 'asc';
  status: number = 1;

  constructor(
    private brandService: BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getCatesPaginator();
    this.initStatuses();
    this.initValidateForm();
  }

  getCatesPaginator() {
    this.isLoading = true;
    this.brandService
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
    this.brands = data.data;
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
    this.resetPage();
    this.getCatesPaginator();
  }

  handleSearch(event: any) {
    this.keyword = event.target.value;
    this.resetFilter();
    this.getCatesPaginator();
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
    this.getCatesPaginator();
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
    let ids = this.selectedBrands.map((cate) => cate.id);
    this.brandService.deleteByIds(ids).subscribe({
      next: () => {
        this.brands = this.brands.filter(
          (brand) => !this.selectedBrands.includes(brand)
        );

        this.showSuccess('Deleted successfully');
        this.selectedBrands = [];
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

  openNew() {
    this.isLoadingEdit = false;
    this.brand = new Brand();
    this.editFormGroup.reset();
    this.brandDialog = true;
  }

  openEdit(brand: Brand) {
    this.isLoadingEdit = false;
    this.brand = { ...brand };
    this.editFormGroup.patchValue({
      name: brand.name,
      description: brand.description,
    });
    this.brandStatus = this.revertStatus(brand.status);
    this.brandDialog = true;
  }

  hideDialog() {
    this.brandDialog = false;
  }

  saveEdit() {
    if (this.editFormGroup.invalid) {
      this.editFormGroup.markAllAsTouched();
      return;
    }
    this.isLoadingEdit = true;
    if (this.brand.id === 0) {
      this.createBrand(this.brand);
    } else {
      this.brand.status = this.unRevertStatus(this.brandStatus);
      this.updateBrand(this.brand);
    }
  }

  createBrand(brand: Brand): any {
    this.brandService.create(brand).subscribe({
      next: () => {
        this.showSuccess('Create successfully');
        this.isLoadingEdit = false;
        this.editFormGroup.reset();
        this.resetFilter();
        this.getCatesPaginator();
        this.brandDialog = false;
        this.brand = new Brand();
      },
      error: (err) => {
        if (err.status === 400) {
          this.brandIsExisted = true;
          this.isLoadingEdit = false;
          return;
        }
        console.log('Create failed: ' + err.message);
        this.showError('Create failed');
        this.isLoadingEdit = false;
      },
    });
  }

  updateBrand(brand: Brand): any {
    this.brandService.update(brand).subscribe({
      next: () => {
        this.showSuccess('Update successfully');
        this.isLoadingEdit = false;
        this.getCatesPaginator();
        this.brandDialog = false;
        this.brand = new Brand();
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

  revertStatus(status: number): boolean {
    return status == 1;
  }

  unRevertStatus(status: boolean): number {
    return status ? 1 : 0;
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
