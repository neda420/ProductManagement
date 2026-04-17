import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  readonly lowStockThreshold = 5;
  products: Product[] = [];
  errorMessage = '';
  isDemoMode = false;
  searchTerm = '';
  stockFilter: 'all' | 'inStock' | 'outOfStock' = 'all';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.isDemoMode = this.productService.isUsingDemoMode();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => {
        this.errorMessage = 'Failed to load products. Ensure the server is running.';
        console.error(err);
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error(err)
      });
    }
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.products.filter((product) => {
      const matchesTerm =
        !term ||
        product.title.toLowerCase().includes(term) ||
        (product.description ?? '').toLowerCase().includes(term);

      const matchesStock =
        this.stockFilter === 'all' ||
        (this.stockFilter === 'inStock' && product.quantity > 0) ||
        (this.stockFilter === 'outOfStock' && product.quantity === 0);

      return matchesTerm && matchesStock;
    });
  }

  get totalProducts(): number {
    return this.products.length;
  }

  get inventoryValue(): number {
    return this.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get lowStockCount(): number {
    return this.products.filter(
      (item) => item.quantity > 0 && item.quantity <= this.lowStockThreshold
    ).length;
  }
}
