import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Brand } from 'src/app/common/brand';
import { Size } from 'src/app/common/size';
import { SizeService } from 'src/app/services/size.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-size-management',
  templateUrl: './size-management.component.html',
  styleUrl: './size-management.component.css',
})
export class SizeManagementComponent implements OnInit {
  sizes!: Size[];
  selectedSizes: Size[] = [];
  statuses!: any[];

  sizeItem: Size = new Size();
  sizeDialog: boolean = false;
  editFormGroup!: FormGroup;
  sizeIsExisted: boolean = false;
  sizeStatus: boolean = true;

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
    private sizeService: SizeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getSizesPaginator();
    this.initStatuses();
    this.initValidateForm();
  }

  getSizesPaginator() {
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
    this.getSizesPaginator();
  }

  handleSearch(event: any) {
    this.keyword = event.target.value;
    this.resetFilter();
    this.getSizesPaginator();
  }

  resetFilter() {
    this.page = 0;
    // this.size = 5;
    this.status = 1;
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.size = event.rows;
    this.getSizesPaginator();
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
    let ids = this.selectedSizes.map((size) => size.id);
    this.sizeService.deleteByIds(ids).subscribe({
      next: () => {
        this.sizes = this.sizes.filter(
          (size) => !this.selectedSizes.includes(size)
        );

        this.showSuccess('Deleted successfully');
        this.selectedSizes = [];
        this.isDeleting = false;
        this.resetFilter();
        this.getSizesPaginator();
      },
      error: (err) => {
        console.log(err);

        this.showError('Error deleting sizegory');
        this.isDeleting = false;
      },
    });
  }

  openNew() {
    this.isLoadingEdit = false;
    this.sizeItem = new Size();
    this.editFormGroup.reset();
    this.sizeDialog = true;
  }

  openEdit(size: Size) {
    this.isLoadingEdit = false;
    this.sizeItem = { ...size };
    this.editFormGroup.patchValue({
      name: size.name,
      description: size.description,
    });
    this.sizeStatus = this.revertStatus(size.status);
    this.sizeDialog = true;
  }

  hideDialog() {
    this.sizeDialog = false;
  }

  saveEdit() {
    if (this.editFormGroup.invalid) {
      this.editFormGroup.markAllAsTouched();
      return;
    }
    this.isLoadingEdit = true;
    if (this.sizeItem.id === 0) {
      this.createSize(this.sizeItem);
    } else {
      this.sizeItem.status = this.unRevertStatus(this.sizeStatus);
      this.updateSize(this.sizeItem);
    }
  }

  createSize(size: Size): any {
    this.sizeService.create(size).subscribe({
      next: () => {
        this.showSuccess('Create successfully');
        this.isLoadingEdit = false;
        this.editFormGroup.reset();
        this.resetFilter();
        this.getSizesPaginator();
        this.sizeDialog = false;
        this.sizeItem = new Size();
      },
      error: (err) => {
        if (err.status === 400) {
          this.sizeIsExisted = true;
          this.isLoadingEdit = false;
          return;
        }
        console.log('Create failed: ' + err.message);
        this.showError('Create failed');
        this.isLoadingEdit = false;
      },
    });
  }

  updateSize(size: Size): any {
    this.sizeService.update(size).subscribe({
      next: () => {
        this.showSuccess('Update successfully');
        this.isLoadingEdit = false;
        this.getSizesPaginator();
        this.sizeDialog = false;
        this.sizeItem = new Size();
      },
      error: (err) => {
        if (err.status === 400) {
          this.sizeIsExisted = true;
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
