import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../interfaces/product';

const FAVORITES_KEY = 'shopping_favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Product[]>(this.loadFavorites());
  public favorites$ = this.favoritesSubject.asObservable();

  private loadFavorites(): Product[] {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  }

  private saveFavorites(items: Product[]) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    this.favoritesSubject.next(items);
  }

  getFavorites(): Product[] {
    return this.favoritesSubject.value;
  }

  isFavorite(productId: string): boolean {
    return this.favoritesSubject.value.some((item) => item._id === productId);
  }

  addFavorite(product: Product): void {
    if (this.isFavorite(product._id)) {
      return;
    }
    const next = [...this.favoritesSubject.value, product];
    this.saveFavorites(next);
  }

  removeFavorite(productId: string): void {
    const next = this.favoritesSubject.value.filter((item) => item._id !== productId);
    this.saveFavorites(next);
  }

  toggleFavorite(product: Product): void {
    if (this.isFavorite(product._id)) {
      this.removeFavorite(product._id);
    } else {
      this.addFavorite(product);
    }
  }
}
