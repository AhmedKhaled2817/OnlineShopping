import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { CurrencyFormatPipe } from '../../core/pipes/currency-format.pipe';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';
import { FavoritesService } from '../../core/services/favorites.service';
import { Product } from '../../../interfaces/product';

@Component({
  standalone: true,
  selector: 'app-wishlist',
  imports: [CommonModule, RouterModule, Button, CurrencyFormatPipe, TruncatePipe],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent {
  public favorites: Product[] = [];

  constructor(private favoritesService: FavoritesService) {
    this.favorites = this.favoritesService.getFavorites();
    this.favoritesService.favorites$.subscribe((items) => {
      this.favorites = items;
    });
  }

  remove(productId: string): void {
    this.favoritesService.removeFavorite(productId);
  }
}
