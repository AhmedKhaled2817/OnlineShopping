import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartAreaService } from '../services/cart-area.service';
import { ProductsAreaService } from '../services/products-area.service';
import { SignErrComponent } from '../sign-err/sign-err.component';
import { forkJoin, map } from 'rxjs';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { getProductImage, setFallbackProductImage } from '../shared/product-image';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, SignErrComponent, Card, Button, Tag, Skeleton, Message],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  public cartList: any[] = [];
  public total: number = 0;
  public isLoading: boolean = false;
  public hasCart: boolean = false;
  public message: string = '';
  public messageSeverity: 'success' | 'warn' = 'warn';

  constructor(
    private cartService: CartAreaService,
    private productService: ProductsAreaService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.message = '';
    this.messageSeverity = 'warn';
    this.cartList = [];
    this.total = 0;
    this.hasCart = false;

    this.cartService.getCart().subscribe({
      next: (data: any) => {
        const cartProducts = data.products || [];
        if (!cartProducts.length) {
          this.hasCart = false;
          this.message = 'Your cart is empty. Add something beautiful to continue shopping.';
          this.isLoading = false;
          return;
        }

        const requests = cartProducts.map((item: any) =>
          this.productService
            .getProductDetailInfo(item.productId)
            .pipe(map((product: any) => ({ ...product, quantity: item.quantity })))
        );

        forkJoin(requests as any).subscribe(
          (items: unknown) => {
            const products = items as any[];
            this.cartList = products;
            this.total = products.reduce(
              (sum: number, product: any) => sum + product.price.current * product.quantity,
              0
            );
            this.hasCart = true;
            this.isLoading = false;
          },
          () => {
            this.message = 'Unable to load cart contents right now. Please try again later.';
            this.messageSeverity = 'warn';
            this.isLoading = false;
          }
        );
      },
      error: () => {
        this.message = 'Unable to load your cart. Please sign in to continue.';
        this.messageSeverity = 'warn';
        this.isLoading = false;
      },
    });
  }

  changeQuantity(item: any, amount: number) {
    const nextQuantity = item.quantity + amount;
    if (nextQuantity < 1) {
      return;
    }

    this.cartService.addtoCart({ id: item._id, quantity: nextQuantity }).subscribe({
      next: () => this.loadCart(),
      error: () => {
        this.message = 'Cannot update quantity at the moment.';
        this.messageSeverity = 'warn';
      },
    });
  }

  removeItem(id: string) {
    this.cartService.deleteProduct({ id }).subscribe({
      next: () => this.loadCart(),
      error: () => {
        this.message = 'Unable to remove item at the moment.';
        this.messageSeverity = 'warn';
      },
    });
  }

  removeAll() {
    this.cartService.removeAll().subscribe({
      next: () => this.loadCart(),
      error: () => {
        this.message = 'Unable to clear the cart right now.';
        this.messageSeverity = 'warn';
      },
    });
  }

  checkout() {
    this.cartService.checkOut().subscribe({
      next: () => {
        this.message = 'Purchase completed successfully. Your cart is now empty.';
        this.messageSeverity = 'success';
        this.cartList = [];
        this.total = 0;
        this.hasCart = false;
      },
      error: () => {
        this.message = 'Checkout failed. Please try again.';
        this.messageSeverity = 'warn';
      },
    });
  }

  productImage(item: any): string {
    return getProductImage(item);
  }

  onProductImageError(event: Event): void {
    setFallbackProductImage(event);
  }
}
