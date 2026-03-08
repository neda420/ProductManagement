import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h3 class="mb-0">{{ isEditMode ? 'Edit' : 'Add' }} Product</h3>
            </div>
            <div class="card-body">
              
              <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

              <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
                
                <div class="mb-3">
                  <label for="title" class="form-label">Title <span class="text-danger">*</span></label>
                  <input type="text" id="title" class="form-control" formControlName="title" 
                         [ngClass]="{'is-invalid': formControls['title'].invalid && (formControls['title'].dirty || formControls['title'].touched)}">
                  <div class="invalid-feedback" *ngIf="formControls['title'].errors?.['required']">
                    Title is required.
                  </div>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea id="description" class="form-control" formControlName="description" rows="3"></textarea>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="price" class="form-label">Price <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input type="number" id="price" step="0.01" class="form-control" formControlName="price"
                             [ngClass]="{'is-invalid': formControls['price'].invalid && (formControls['price'].dirty || formControls['price'].touched)}">
                      <div class="invalid-feedback" *ngIf="formControls['price'].errors?.['required']">
                        Price is required.
                      </div>
                      <div class="invalid-feedback" *ngIf="formControls['price'].errors?.['min']">
                        Price must be strictly greater than 0.
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <label for="quantity" class="form-label">Quantity</label>
                    <input type="number" id="quantity" class="form-control" formControlName="quantity">
                  </div>
                </div>

                <div class="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" routerLink="/" class="btn btn-light">Cancel</button>
                  <button type="submit" class="btn btn-primary" [disabled]="productForm.invalid || isSubmitting">
                    <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isEditMode ? 'Update' : 'Save' }} Product
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
    productForm: FormGroup;
    isEditMode = false;
    productId?: number;
    isSubmitting = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.productForm = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            price: [null, [Validators.required, Validators.min(0.01)]],
            quantity: [0]
        });
    }

    ngOnInit(): void {
        this.productId = this.route.snapshot.params['id'];
        if (this.productId) {
            this.isEditMode = true;
            this.loadProduct();
        }
    }

    get formControls() {
        return this.productForm.controls;
    }

    loadProduct(): void {
        this.productService.getProduct(this.productId!).subscribe({
            next: (product) => {
                this.productForm.patchValue({
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity
                });
            },
            error: (err) => {
                this.errorMessage = 'Failed to load product. It might have been deleted.';
                console.error(err);
            }
        });
    }

    onSubmit(): void {
        if (this.productForm.invalid) {
            return;
        }

        this.isSubmitting = true;
        this.errorMessage = '';

        const productData: Product = {
            ...this.productForm.value
        };

        if (this.isEditMode) {
            productData.id = this.productId;
            this.productService.updateProduct(this.productId!, productData).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage = 'Failed to update product. Ensure backend is running and price is > 0.';
                    this.isSubmitting = false;
                    console.error(err);
                }
            });
        } else {
            this.productService.createProduct(productData).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage = 'Failed to create product. Ensure backend is running and price is > 0.';
                    this.isSubmitting = false;
                    console.error(err);
                }
            });
        }
    }
}
