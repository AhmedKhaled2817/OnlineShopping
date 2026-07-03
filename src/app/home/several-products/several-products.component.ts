import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { AllProductArea } from '../../../interfaces/all-product-area';
import { ProductsAreaService } from '../../services/products-area.service';
import { CartAreaService } from '../../services/cart-area.service';
import { ApiAreaService } from '../../services/api-area.service';
import { ToolsService } from '../../services/tools.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { FavoritesService } from '../../core/services/favorites.service';
import { getProductImage, setFallbackProductImage } from '../../shared/product-image';

@Component({
  standalone: true,
  selector: 'app-several-products',
  imports: [CommonModule, RouterModule, FormsModule, Button, Rating, Tag],
  templateUrl: './several-products.component.html',
  styleUrls: ['./several-products.component.css'],
})
export class SeveralProductsComponent implements OnInit {
  public productList: Product[] = [];
  public favoriteIds = new Set<string>();
  public isLoading: boolean = false;
  public errorMessage: string = '';

  constructor(
    private service: ProductsAreaService,
    private cartServ: CartAreaService,
    private apiArea: ApiAreaService,
    private tools: ToolsService,
    private cookie: CookieService,
    private messages: MessageService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.showCards();
    this.favoritesService.favorites$.subscribe((items) => {
      this.favoriteIds = new Set(items.map((product) => product._id));
    });
  }

  roundedRating(value: number): number {
    return Math.round(value);
  }

  showCards() {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getCardsforHome().subscribe({
      next: (data: AllProductArea) => {
        this.productList = data.products.slice(0, 8);
        this.isLoading = false;
      },
      error: () => {
        this.productList = [];
        this.errorMessage = 'Featured products could not be loaded.';
        this.isLoading = false;
      },
    });
  }

  addToCart(id: string) {
    if (!this.cookie.get('user')) {
      this.tools.isErrSMS.next(true);
      return;
    }
    const prodInfoCart = { id, quantity: 1 };
    this.apiArea.profileInfo().subscribe((data: { cartID?: string }) => {
      const request = data.cartID
        ? this.cartServ.addtoCart(prodInfoCart)
        : this.cartServ.createCart(prodInfoCart);
      request.subscribe({
        next: () =>
          this.messages.add({
            severity: 'success',
            summary: 'Added to cart',
            detail: 'Product added to your bag.',
            life: 2500,
          }),
        error: () =>
          this.messages.add({
            severity: 'error',
            summary: 'Cart error',
            detail: 'Could not add product right now.',
            life: 3000,
          }),
      });
    });
  }

  productImage(product: Product): string {
    return getProductImage(product);
  }

  isFavorite(productId: string): boolean {
    return this.favoriteIds.has(productId);
  }

  toggleFavorite(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favoritesService.toggleFavorite(product);
  }

  onProductImageError(event: Event): void {
    setFallbackProductImage(event);
  }
}
