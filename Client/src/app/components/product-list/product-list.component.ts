import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Catalog</h2>
        <a routerLink="/add" class="btn btn-primary">Add New Product</a>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-0">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Updated At</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of products">
                <td>{{ product.id }}</td>
                <td><strong>{{ product.title }}</strong></td>
                <td>{{ product.description }}</td>
                <td>{{ product.price | currency }}</td>
                <td>
                  <span class="badge" [ngClass]="product.quantity > 0 ? 'bg-success' : 'bg-danger'">
                    {{ product.quantity }}
                  </span>
                </td>
                <td>{{ product.updatedAt | date:'short' }}</td>
                <td class="text-end">
                  <a [routerLink]="['/edit', product.id]" class="btn btn-sm btn-outline-secondary me-2">Edit</a>
                  <button (click)="deleteProduct(product.id!)" class="btn btn-sm btn-outline-danger">Delete</button>
                </td>
              </tr>
              <tr *ngIf="products.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">No products found. Add one!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.productService.getProducts().subscribe({
            next: (data) => {
                this.products = data;
            },
            error: (err) => console.error(err)
        });
    }

    deleteProduct(id: number): void {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe({
                next: () => {
                    this.loadProducts();
                },
                error: (err) => console.error(err)
            });
        }
    }
}
