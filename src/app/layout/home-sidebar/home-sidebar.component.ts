import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { CartAreaService } from '../../services/cart-area.service';
import { ProductsAreaService } from '../../services/products-area.service';
import { forkJoin, map } from 'rxjs';
import { getProductImage, setFallbackProductImage } from '../../shared/product-image';

interface CartLine {
  _id: string;
  title: string;
  thumbnail?: string;
  images: string[];
  price: { current: number };
  quantity: number;
}

@Component({
  standalone: true,
  selector: 'app-home-sidebar',
  imports: [CommonModule, RouterModule, Card, Button, Skeleton, Tag],
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.css'],
})
export class HomeSidebarComponent implements OnInit {
  cartItems: CartLine[] = [];
  subtotal = 0;
  isLoading = true;
  hasCart = false;
  readonly shippingFreeThreshold = 75;

  constructor(
    private cartService: CartAreaService,
    private productService: ProductsAreaService
  ) {}

  ngOnInit(): void {
    this.loadCartPreview();
  }

  get shipping(): number {
    return this.subtotal > 0 && this.subtotal < this.shippingFreeThreshold ? 10 : 0;
  }

  get total(): number {
    return this.subtotal + this.shipping;
  }

  loadCartPreview(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (data: { products?: { productId: string; quantity: number }[] }) => {
        const lines = data.products || [];
        if (!lines.length) {
          this.resetCart();
          return;
        }
        const requests = lines.slice(0, 3).map((item) =>
          this.productService
            .getProductDetailInfo(item.productId)
            .pipe(map((product) => ({ ...product, quantity: item.quantity } as CartLine)))
        );
        forkJoin(requests).subscribe({
          next: (items) => {
            this.cartItems = items;
            this.subtotal = items.reduce(
              (sum, p) => sum + p.price.current * p.quantity,
              0
            );
            this.hasCart = true;
            this.isLoading = false;
          },
          error: () => this.resetCart(),
        });
      },
      error: () => this.resetCart(),
    });
  }

  private resetCart(): void {
    this.cartItems = [];
    this.subtotal = 0;
    this.hasCart = false;
    this.isLoading = false;
  }

  productImage(item: CartLine): string {
    return getProductImage(item);
  }

  onProductImageError(event: Event): void {
    setFallbackProductImage(event);
  }
}
