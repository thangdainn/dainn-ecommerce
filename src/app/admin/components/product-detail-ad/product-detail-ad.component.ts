import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Brand } from 'src/app/common/brand';
import { Category } from 'src/app/common/category';
import { Product } from 'src/app/common/product';
import { ProductSize } from 'src/app/common/product-size';
import { Size } from 'src/app/common/size';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SizeService } from 'src/app/services/size.service';
import { environment } from 'src/environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-detail-ad',
  templateUrl: './product-detail-ad.component.html',
  styleUrl: './product-detail-ad.component.css',
})
export class ProductDetailAdComponent implements OnInit {
  uploadUrl = environment.apiUrl + '/api/upload';
  product: Product = new Product();
  statuses!: any[];

  categories!: Category[];
  brands!: Brand[];
  sizes!: Size[];
  selectedSizes: ProductSize[] = [];
  attributes: ProductSize[] = [];

  productForm!: FormGroup;
  productIsExisted: boolean = false;
  userStatus: boolean = true;

  isLoading: boolean = false;
  status: number = 1;

  constructor(
    private productService: ProductService,
    private cateService: CategoryService,
    private brandService: BrandService,
    private sizeService: SizeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initValidateForm();
    this.handleUpdateMode();
    this.initStatuses();
    this.initCategories();
    this.initBrands();
  }

  private initValidateForm() {
    this.productForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      imageUrls: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(1000)]),
      categoryId: new FormControl('', [Validators.required]),
      brandId: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    });
  }

  isCreateMode(): boolean {
    return this.activeRoute.snapshot.url[1].path === 'create';
  }

  initAttributes() {
    this.productService
      .getProductSizeByCode(this.product.code)
      .subscribe((data) => {
        this.selectedSizes = data.map((attr) => {
          let ps = this.attributes.find((item) => item.sizeId === attr.sizeId);
          if (!ps) {
            ps = new ProductSize(0, 0, attr.sizeId, attr.sizeName, this.product.id);
          }
          ps.quantity = attr.quantity;
          return ps;
        });
        this.isLoading = false;
      });
  }

  saveAttributes() {
    this.isLoading = true;
    this.productService.saveAttributes(this.selectedSizes).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Save failed: ' + err.message);
        this.isLoading = false;
      },
    });
  }

  async onTabChange(event: any) {
    const tabIndex = event.index;
    if (tabIndex === 1) {
      this.isLoading = true;
      this.sizes = await firstValueFrom(this.sizeService.getAll());
      this.attributes = this.sizes.map((size) => {
        return new ProductSize(0, 0, size.id, size.name, this.product.id);
      });
      if (this.product.id !== 0){
        this.initAttributes();
      } else {
        this.isLoading = false;
      }
    }
  }

  handleUpdateMode() {
    if (this.isCreateMode()) {
      this.productForm.patchValue({ status: 1 });
      return;
    }
    this.activeRoute.params.subscribe((params) => {
      const code = params['code'];
      this.productService.getByCode(code).subscribe((data) => {
        this.product = data;
        this.updateForm();
      });
    });
  }

  removeExistingImage(index: number) {
    if (this.product.imageUrls && this.product.imageUrls.length > index) {
      this.product.imageUrls.splice(index, 1);
    }
    console.log(this.product.imageUrls);
    
  }

  onUploadImage(event: any) {
    const url = event.originalEvent.body.url;
    this.product.image = url;
    this.productForm.patchValue({ image: url });
  }

  onUploadImages(event: any) {
    const url = event.originalEvent.body.url;
    this.product.imageUrls.push(url);
    this.productForm.patchValue({ imageUrls: this.product.imageUrls });
  }

  updateForm() {
    this.productForm.patchValue({
      name: this.product.name,
      description: this.product.description,
      image: this.product.image,
      imageUrls: this.product.imageUrls,
      price: this.product.price,
      categoryId: this.product.categoryId,
      brandId: this.product.brandId,
      status: this.product.status,
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

  initCategories() {
    this.cateService.getAll().subscribe((data) => {
      this.categories = data;
    });
  }

  initBrands() {
    this.brandService.getAll().subscribe((data) => {
      this.brands = data;
    });
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.isLoading = true;
        this.deleteProduct();
      },
    });
  }

  confirmEnable(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to enable?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-success p-button-sm',
      accept: () => {
        this.isLoading = true;
        this.product.status = 1;
        this.updateProduct(this.product);
      },
    });
  }

  choose(event: any, callback: () => void) {
    callback();
  }

  deleteProduct() {
    this.productService.deleteByIds([this.product.id]).subscribe({
      next: () => {
        this.isLoading = false;
        this.product.status = 0;
        this.showSuccess('Delete successfully');
      },
      error: (err) => {
        this.isLoading = false;
        console.log('Delete failed: ' + err.message);
        this.showError('Delete failed');
      },
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const product = this.productForm.value;
    product.image = this.product.image;
    product.imageUrls = this.product.imageUrls;
    
    if (this.isCreateMode()) {
      this.createProduct(product);
    } else {
      product.id = this.product.id;
      this.updateProduct(product);
    }
  }

  async createProduct(product: Product) {
    const resp = await firstValueFrom(this.productService.create(product));
    this.selectedSizes.forEach((size) => {
      size.productId = resp.id;
    });

    this.selectedSizes ?? this.saveAttributes();
    this.showSuccess('Create successfully');
    this.isLoading = false;
    this.productForm.reset();
    this.product = new Product();
    this.selectedSizes = [];
    this.productForm.patchValue({ status: 1 });
  }

  updateProduct(product: Product) {
    this.productService.update(product).subscribe({
      next: () => {
        this.isLoading = false;
        this.product.modifiedDate = product.modifiedDate;
        this.showSuccess('Update successfully');
      },
      error: (err) => {
        if (err.status === 400) {
          this.productIsExisted = true;
          this.isLoading = false;
          return;
        }
        console.log('Update failed: ' + err.message);
        this.showError('Update failed');
        this.isLoading = false;
      },
    });
  }

  removeImage(url: string) {}

  revertStatus(status: number): boolean {
    return status == 1;
  }

  unRevertStatus(status: boolean): number {
    return status ? 1 : 0;
  }

  get name() {
    return this.productForm.get('name');
  }

  get description() {
    return this.productForm.get('description');
  }

  get image() {
    return this.productForm.get('image');
  }

  get images() {
    return this.productForm.get('images');
  }

  get price() {
    return this.productForm.get('price');
  }

  get categoryId() {
    return this.productForm.get('categoryId');
  }

  get brandId() {
    return this.productForm.get('brandId');
  }

  get sizeIds() {
    return this.productForm.get('sizeIds');
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
