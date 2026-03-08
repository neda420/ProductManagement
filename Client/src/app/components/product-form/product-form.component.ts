import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
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
      title: ['', [Validators.required]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.productId = +id;
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  get f() {
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
      error: () => {
        this.errorMessage = 'Failed to load product details.';
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const productData: Product = { ...this.productForm.value };

    if (this.isEditMode) {
      productData.id = this.productId;
      this.productService.updateProduct(this.productId!, productData).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => {
          this.errorMessage = 'Failed to update product. Please check all fields and try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => {
          this.errorMessage = 'Failed to create product. Please check all fields and try again.';
          this.isSubmitting = false;
        }
      });
    }
  }
}
