import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { ProductCategory } from '../../../interfaces/product-category';

export interface CategoryCard {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

@Component({
  standalone: true,
  selector: 'app-category-grid',
  imports: [RouterModule, Button],
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css'],
})
export class CategoryGridComponent {
  categories = input<ProductCategory[]>([]);
  categorySelect = output<string>();

  private readonly iconMap: Record<string, string> = {
    electronics: 'fa-laptop',
    fashion: 'fa-shirt',
    home: 'fa-couch',
    beauty: 'fa-spa',
    sports: 'fa-football',
    toys: 'fa-gamepad',
    books: 'fa-book',
    default: 'fa-bag-shopping',
  };

  cards(): CategoryCard[] {
    const fromApi = this.categories();
    if (fromApi.length) {
      return fromApi.slice(0, 6).map((category, index) => ({
        id: category.id,
        name: this.formatName(category.name),
        icon: this.iconFor(category.name),
        count: [245, 189, 156, 98, 124, 87][index] ?? 100,
      }));
    }
    return this.defaultCards;
  }

  private readonly defaultCards: CategoryCard[] = [
    { id: '1', name: 'Laptops', icon: 'fa-laptop', count: 245 },
    { id: '2', name: 'Phones', icon: 'fa-mobile-screen', count: 189 },
  ];

  private formatName(value: string): string {
    return value
      .split(/[-_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private iconFor(name: string): string {
    const key = name.toLowerCase();
    for (const [token, icon] of Object.entries(this.iconMap)) {
      if (key.includes(token)) {
        return icon;
      }
    }
    return this.iconMap['default'];
  }

  onSelect(id: string): void {
    this.categorySelect.emit(id);
  }
}
