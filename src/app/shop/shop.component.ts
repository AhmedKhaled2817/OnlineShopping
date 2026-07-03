import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProductsAreaService } from '../services/products-area.service';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product';
import { AllProductArea } from '../../interfaces/all-product-area';
import { FilteredProducts } from '../../interfaces/filtered-products';
import { RouterModule } from '@angular/router';
import { ToolsService } from '../services/tools.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { CurrencyFormatPipe } from '../core/pipes/currency-format.pipe';
import { TruncatePipe } from '../core/pipes/truncate.pipe';
import { Message } from 'primeng/message';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { FavoritesService } from '../core/services/favorites.service';
import { ProductCategory } from '../../interfaces/product-category';
import { getProductImage, setFallbackProductImage } from '../shared/product-image';

@Component({
  selector: 'app-shop',
  imports: [
    CommonModule,
    SidebarComponent,
    FormsModule,
    RouterModule,
    Button,
    Message,
    Paginator,
    Select,
    Skeleton,
    Tag,
    CurrencyFormatPipe,
    TruncatePipe,
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  public favoriteIds = new Set<string>();

  constructor(
    private prodService: ProductsAreaService,
    private tools: ToolsService,
    private destroyRef: DestroyRef,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.showProducts(this.currentPage, this.pageSize);
    this.getCategoriesList();

    this.tools.homeCategorySelection
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((category) => {
        if (category) {
          this.showByCategory(category, 1);
          this.tools.homeCategorySelection.next('');
        }
      });

    this.tools.homeSearchQuery
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        if (query) {
          this.search(query);
          this.tools.homeSearchQuery.next('');
        }
      });

    this.favoritesService.favorites$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.favoriteIds = new Set(items.map((product) => product._id));
      });
  }
  protected categories: ProductCategory[] = [];
  public currentCategory: any;
  public productList: Product[] = [];
  public pageList: number[] = [];
  public currentPage: number = 1;
  public pageSize: any = 15;
  public totalSize!: any;
  public isCategoryShown: boolean = false;
  public isLoading: boolean = false;
  public errorMessage: string = '';

  pageSizeOptions = [
    { label: 'All', value: '' },
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
    { label: '25', value: 25 },
  ];

  pagination(data: FilteredProducts | AllProductArea) {
    this.pageList = [];
    this.productList = data.products;
    const activePageSize = Number(this.pageSize || data.total || data.products.length || 1);
    let pages = Math.ceil(data.total / activePageSize);

    for (let i = 1; i <= pages; i++) {
      this.pageList.push(i);
    }
  }

  showProducts(page: number | string = 1, size: number = this.totalSize) {
    this.isCategoryShown = false;
    this.currentPage = +page;
    this.isLoading = true;
    this.errorMessage = '';
    this.prodService
      .getCardsOnShopPage(page, size)
      .subscribe({
        next: (data: AllProductArea) => {
          this.totalSize = data.total;
          this.pagination(data);
          this.isLoading = false;
        },
        error: () => {
          this.productList = [];
          this.errorMessage = 'Products could not be loaded right now. Please try again.';
          this.isLoading = false;
        },
      });
  }

  search(search: string) {
    this.isCategoryShown = false;
    this.currentPage = 1;
    this.isLoading = true;
    this.errorMessage = '';
    this.prodService
      .getSearchedData(search, this.pageSize)
      .subscribe({
        next: (data: FilteredProducts) => {
          this.pagination(data);
          this.totalSize = data.total;
          this.isLoading = false;
        },
        error: () => {
          this.productList = [];
          this.errorMessage = 'Search failed. Try another keyword.';
          this.isLoading = false;
        },
      });
  }

  filterProducts(info: any) {
    this.currentPage = 1;
    this.isLoading = true;
    this.errorMessage = '';
    this.prodService
      .filterData(
        info.search || '',
        info.rating ?? '',
        info.min || '1',
        info.max || '99999',
        info.type,
        info.sort,
        this.pageSize
      )
      .subscribe({
        next: (data: FilteredProducts) => {
          this.pagination(data);
          this.totalSize = data.total;
          this.isLoading = false;
        },
        error: () => {
          this.productList = [];
          this.errorMessage = 'Filter results could not be loaded.';
          this.isLoading = false;
        },
      });
  }

  switchBrands(dataOfBrand: AllProductArea) {
    this.isCategoryShown = false;
    this.productList = dataOfBrand.products;
    this.totalSize = dataOfBrand.total;
    this.pageList = [1];
  }

  changePageSize() {
    this.currentPage = 1;
    let pageArea = this.pageSize == '' ? this.totalSize : this.pageSize;

    if (!this.isCategoryShown) {
      this.showProducts(this.currentPage, pageArea);
    } else {
      this.showByCategory(this.currentCategory, this.currentPage);
    }
  }

  prevPage() {
    this.currentPage--;
    if (!this.isCategoryShown) {
      this.showProducts(this.currentPage, this.pageSize);
    } else {
      this.showByCategory(this.currentCategory, this.currentPage);
    }
  }

  nextPage() {
    this.currentPage++;
    if (!this.isCategoryShown) {
      this.showProducts(this.currentPage, this.pageSize);
    } else {
      this.showByCategory(this.currentCategory, this.currentPage);
    }
  }

  getCategoriesList() {
    this.prodService.getCategories().subscribe((list: ProductCategory[]) => {
      this.categories = list;
    });
  }

  onPageChange(event: PaginatorState): void {
    const page = (event.page ?? 0) + 1;
    if (!this.isCategoryShown) {
      this.showProducts(page, this.pageSize);
    } else {
      this.showByCategory(this.currentCategory, page);
    }
  }

  showByCategory(category: string, pageNum: any) {
    this.isCategoryShown = true;
    this.currentCategory = category;
    this.currentPage = pageNum;
    this.isLoading = true;
    this.errorMessage = '';
    this.prodService
      .getListByCategory(category, this.currentPage, this.pageSize)
      .subscribe({
        next: (data: AllProductArea) => {
          this.totalSize = data.total;
          this.pagination(data);
          this.isLoading = false;
        },
        error: () => {
          this.productList = [];
          this.errorMessage = 'Category products could not be loaded.';
          this.isLoading = false;
        },
      });
  }

  isFavorite(productId: string): boolean {
    return this.favoriteIds.has(productId);
  }

  toggleFavorite(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favoritesService.toggleFavorite(product);
  }

  productImage(product: Product): string {
    return getProductImage(product);
  }

  onProductImageError(event: Event): void {
    setFallbackProductImage(event);
  }
}
