import { inject, signal } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BannerComponent } from './banner/banner.component';
import { SeveralProductsComponent } from './several-products/several-products.component';
import { FeatureBarComponent } from '../layout/feature-bar/feature-bar.component';
import { CategoryGridComponent } from '../layout/category-grid/category-grid.component';
import { HomeSidebarComponent } from '../layout/home-sidebar/home-sidebar.component';
import { Button } from 'primeng/button';
import { ProductsAreaService } from '../services/products-area.service';
import { ToolsService } from '../services/tools.service';
import { ProductCategory } from '../../interfaces/product-category';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    BannerComponent,
    FeatureBarComponent,
    CategoryGridComponent,
    HomeSidebarComponent,
    SeveralProductsComponent,
    Button,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductsAreaService);
  private router = inject(Router);
  private tools = inject(ToolsService);

  public categories = signal<ProductCategory[]>([]);
  public isLoading = signal(false);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.productService.getCategories().subscribe({
      next: (categories: ProductCategory[]) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: () => {
        this.categories.set([
          { id: '1', name: 'laptops', image: '' },
          { id: '2', name: 'phones', image: '' },
        ]);
        this.isLoading.set(false);
      },
    });
  }

  goToCategory(categoryId: string): void {
    this.tools.homeCategorySelection.next(categoryId);
    this.router.navigate(['/shop']);
  }
}
