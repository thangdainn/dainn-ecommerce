import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Brand } from 'src/app/common/brand';
import { Size } from 'src/app/common/size';
import { SizeService } from 'src/app/services/size.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-size-action',
  templateUrl: './size-action.component.html',
  styleUrl: './size-action.component.css',
})
export class SizeActionComponent implements OnInit {
  editFormGroup!: FormGroup;
  sizeIsExisted: boolean = false;
  size: Size = new Size();
  status: boolean = true;

  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private sizeService: SizeService,
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
        this.sizeService.getById(id).subscribe((data) => {
          this.size = data;
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
    this.size.name = this.editFormGroup.value.name;
    this.size.description = this.editFormGroup.value.description;
    if (this.isCreateMode()) {
      this.createSize(this.size);
    } else {
      this.size.status = this.unRevertStatus(this.status);
      this.updateSize(this.size);
    }
  }

  createSize(size: Size) {
    this.sizeService.create(size).subscribe({
      next: () => {
        this.showSuccess('Create successfully');
        this.isLoading = false;
        this.editFormGroup.reset();
      },
      error: (err) => {
        if (err.status === 400) {
          this.sizeIsExisted = true;
          this.isLoading = false;
          return;
        }
        console.log('Create failed: ' + err.message);
        this.showError('Create failed');
        this.isLoading = false;
      },
    });
  }

  updateSize(size: Size) {
    this.sizeService.update(size).subscribe({
      next: () => {
        this.showSuccess('Update successfully');
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 400) {
          this.sizeIsExisted = true;
          this.isLoading = false;
          return;
        }
        console.log('Update failed: ' + err.message);
        this.showError('Update failed');
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
