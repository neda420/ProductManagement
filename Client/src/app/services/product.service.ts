import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:5286/api/products';
    private readonly localStorageKey = 'product-management-demo-products';
    private readonly isDemoMode =
        typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

    constructor(private http: HttpClient) {
        if (this.isDemoMode) {
            this.seedDemoProducts();
        }
    }

    isUsingDemoMode(): boolean {
        return this.isDemoMode;
    }

    getProducts(): Observable<Product[]> {
        if (this.isDemoMode) {
            return of(
                this.readProducts().sort(
                    (a, b) =>
                        new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
                )
            );
        }

        return this.http.get<Product[]>(this.apiUrl);
    }

    getProduct(id: number): Observable<Product> {
        if (this.isDemoMode) {
            const product = this.readProducts().find((p) => p.id === id);
            return product
                ? of(product)
                : throwError(() => new Error('Product not found in demo data.'));
        }

        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: Product): Observable<Product> {
        if (this.isDemoMode) {
            const products = this.readProducts();
            const created: Product = {
                ...product,
                id: this.getNextId(products),
                updatedAt: new Date()
            };
            products.push(created);
            this.writeProducts(products);
            return of(created);
        }

        return this.http.post<Product>(this.apiUrl, product);
    }

    updateProduct(id: number, product: Product): Observable<any> {
        if (this.isDemoMode) {
            const products = this.readProducts();
            const index = products.findIndex((p) => p.id === id);
            if (index === -1) {
                return throwError(() => new Error('Product not found in demo data.'));
            }

            products[index] = {
                ...products[index],
                ...product,
                id,
                updatedAt: new Date()
            };
            this.writeProducts(products);
            return of(products[index]);
        }

        return this.http.put(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: number): Observable<any> {
        if (this.isDemoMode) {
            const products = this.readProducts();
            this.writeProducts(products.filter((p) => p.id !== id));
            return of({ success: true });
        }

        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    private seedDemoProducts(): void {
        if (localStorage.getItem(this.localStorageKey)) {
            return;
        }

        const now = new Date();
        const demoProducts: Product[] = [
            {
                id: 1,
                title: 'Wireless Ergonomic Mouse',
                description: 'Comfort-focused mouse with quiet clicks and long battery life.',
                price: 34.99,
                quantity: 25,
                updatedAt: now
            },
            {
                id: 2,
                title: '4K Portable Monitor',
                description: '15.6" USB-C display for travel and dual-screen productivity.',
                price: 219.0,
                quantity: 7,
                updatedAt: now
            },
            {
                id: 3,
                title: 'Mechanical Keyboard',
                description: 'Hot-swappable keyboard with RGB backlight and tactile switches.',
                price: 89.5,
                quantity: 0,
                updatedAt: now
            }
        ];

        this.writeProducts(demoProducts);
    }

    private readProducts(): Product[] {
        const raw = localStorage.getItem(this.localStorageKey);
        if (!raw) {
            return [];
        }

        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }

    private writeProducts(products: Product[]): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(products));
    }

    private getNextId(products: Product[]): number {
        return products.reduce((max, product) => Math.max(max, product.id ?? 0), 0) + 1;
    }
}
