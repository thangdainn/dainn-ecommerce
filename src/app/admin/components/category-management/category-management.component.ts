import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Category } from 'src/app/common/category';
import { CategoryService } from 'src/app/services/category.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css',
})
export class CategoryManagementComponent implements OnInit {
  categories!: Category[];
  selectedCates: Category[] = [];
  statuses!: any[];

  cate: Category = new Category();
  cateDialog: boolean = false;
  editFormGroup!: FormGroup;
  cateIsExisted: boolean = false;
  cateStatus: boolean = true;

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
    private categoryService: CategoryService,
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
    this.size = 5;
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

        this.showSuccess('Delete successfully');
        this.selectedCates = [];
        this.isDeleting = false;
        this.resetFilter();
        this.getCatesPaginator();
      },
      error: (err) => {
        console.log(err);

        this.showError('Error delete');
        this.isDeleting = false;
      },
    });
  }

  openNew() {
    this.isLoadingEdit = false;
    this.cate = new Category();
    this.editFormGroup.reset();
    this.cateDialog = true;
  }

  openEdit(cate: Category) {
    this.isLoadingEdit = false;
    this.cate = { ...cate };
    this.editFormGroup.patchValue({
      name: cate.name,
      description: cate.description,
    });
    this.cateStatus = this.revertStatus(cate.status);
    this.cateDialog = true;
  }

  hideDialog() {
    this.cateDialog = false;
  }

  saveEdit() {
    if (this.editFormGroup.invalid) {
      this.editFormGroup.markAllAsTouched();
      return;
    }
    this.isLoadingEdit = true;
    if (this.cate.id === 0) {
      this.createCate(this.cate);
    } else {
      this.cate.status = this.unRevertStatus(this.cateStatus);
      this.updateCate(this.cate);
    }
  }

  createCate(cate: Category): any {
    this.categoryService.create(cate).subscribe({
      next: () => {
        this.showSuccess('Create successfully');
        this.isLoadingEdit = false;
        this.editFormGroup.reset();
        this.resetFilter();
        this.getCatesPaginator();
        this.cateDialog = false;
        this.cate = new Category();
      },
      error: (err) => {
        if (err.status === 400) {
          this.cateIsExisted = true;
          this.isLoadingEdit = false;
          return;
        }
        console.log('Create failed: ' + err.message);
        this.showError('Create failed');
        this.isLoadingEdit = false;
      },
    });
  }

  updateCate(cate: Category): any {
    this.categoryService.update(cate).subscribe({
      next: () => {
        this.showSuccess('Update successfully');
        this.isLoadingEdit = false;
        this.getCatesPaginator();
        this.cateDialog = false;
        this.cate = new Category();
      },
      error: (err) => {
        if (err.status === 400) {
          this.cateIsExisted = true;
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
