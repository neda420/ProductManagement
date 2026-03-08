import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterModule],
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-box-seam me-2"></i>Product Catalog
        </a>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
    title = 'Product Management Client';
}
