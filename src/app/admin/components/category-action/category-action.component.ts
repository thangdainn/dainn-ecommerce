import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Category } from 'src/app/common/category';
import { Role } from 'src/app/common/role';
import { CategoryService } from 'src/app/services/category.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-category-action',
  templateUrl: './category-action.component.html',
  styleUrl: './category-action.component.css'
})
export class CategoryActionComponent  implements OnInit {
  editFormGroup!: FormGroup;
  cateIsExisted: boolean = false;
  cate: Category = new Role();
  status: boolean = true;

  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private cateService: CategoryService,
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
        this.cateService.getById(id).subscribe((data) => {
          this.cate = data;
          this.status = this.revertStatus(data.status);
          console.log(this.revertStatus(data.status));

          this.editFormGroup.patchValue({
            name: data.name.split('_')[1],
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
    this.cate.name = this.editFormGroup.value.name;
    this.cate.description = this.editFormGroup.value.description;
    if (this.isCreateMode()) {
      this.createCate(this.cate);
    } else {
      this.cate.status = this.unRevertStatus(this.status);
      this.updateCate(this.cate);
    }
  }

  createCate(cate: Category) {
    this.cateService.create(cate).subscribe({
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

  updateCate(cate: Category) {
    this.cateService.update(cate).subscribe({
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
