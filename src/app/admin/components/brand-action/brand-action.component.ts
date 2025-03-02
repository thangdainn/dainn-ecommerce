import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Brand } from 'src/app/common/brand';
import { BrandService } from 'src/app/services/brand.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-brand-action',
  templateUrl: './brand-action.component.html',
  styleUrl: './brand-action.component.css'
})
export class BrandActionComponent   implements OnInit {
  editFormGroup!: FormGroup;
  brandIsExisted: boolean = false;
  brand: Brand = new Brand();
  status: boolean = true;

  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private brandService: BrandService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.validateForm();
    this.handleUpdateMode();
  }

  private validateForm() {
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

  isCreateMode(): boolean {
    return this.activeRoute.snapshot.url[1].path === 'create';
  }

  handleUpdateMode() {
    if (!this.isCreateMode()) {
      this.activeRoute.params.subscribe((params) => {
        const id = params['id'];
        this.brandService.getById(id).subscribe((data) => {
          this.brand = data;
          this.status = this.revertStatus(data.status);
          console.log(this.revertStatus(data.status));

          this.editFormGroup.patchValue({
            name: data.name,
            description: data.description,
          });
        });
      });
    }
  }

  get name() {
    return this.editFormGroup.get('name');
  }

  get description() {
    return this.editFormGroup.get('description');
  }

  revertStatus(status: number): boolean {
    return status == 1;
  }

  unRevertStatus(status: boolean): number {
    return status ? 1 : 0;
  }

  onSubmit() {
    if (this.editFormGroup.invalid) {
      this.editFormGroup.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.brand.name = this.editFormGroup.value.name;
    this.brand.description = this.editFormGroup.value.description;
    if (this.isCreateMode()) {
      this.createBrand(this.brand);
    } else {
      this.brand.status = this.unRevertStatus(this.status);
      this.updateBrand(this.brand);
    }
  }

  createBrand(brand: Brand) {
    this.brandService.create(brand).subscribe({
      next: () => {
        this.showSuccess('Create role successfully');
        this.isLoading = false;
        this.editFormGroup.reset();
      },
      error: (err) => {
        console.log('Create role failed: ' + err.message);
        this.showError('Create role failed');
        this.isLoading = false;
      },
    });
  }

  updateBrand(brand: Brand) {
    this.brandService.update(brand).subscribe({
      next: () => {
        this.showSuccess('Update role successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Update role failed: ' + err.message);
        this.showError('Update role failed');
        this.isLoading = false;
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
