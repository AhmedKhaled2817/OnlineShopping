import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ProductsAreaService } from '../../../services/products-area.service';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../interfaces/product';
import { AllProductArea } from '../../../../interfaces/all-product-area';
import { getProductImage, setFallbackProductImage } from '../../../shared/product-image';

@Component({
  selector: 'app-related-prods',
  imports: [RouterModule],
  templateUrl: './related-prods.component.html',
  styleUrls: ['./related-prods.component.css'],
})
export class RelatedProdsComponent implements OnInit {
  constructor(private serv: ProductsAreaService) {}
  @Input() public categoryID: string | undefined;
  @Output() public otherRelated: EventEmitter<any> = new EventEmitter();
  public relatedProds: Product[] = [];

  ngOnInit(): void {
    this.getRelatedProds();
  }

  otherRelatedPage(id: string) {
    this.otherRelated.emit(id);
  }

  getRelatedProds() {
    this.serv
      .getListByCategory(this.categoryID, 1, 5)
      .subscribe((data: AllProductArea) => {
        let filtered = data.products.filter(
          (item: any) => item._id != this.categoryID
        );

        this.relatedProds = filtered;
      });
  }

  productImage(product: Product): string {
    return getProductImage(product);
  }

  onProductImageError(event: Event): void {
    setFallbackProductImage(event);
  }
}
