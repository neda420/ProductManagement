import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'add',
        loadComponent: () => import('./components/product-form/product-form.component').then(m => m.ProductFormComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/product-form/product-form.component').then(m => m.ProductFormComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
