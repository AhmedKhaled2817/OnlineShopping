import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductsAreaService } from '../../services/products-area.service';
import { CommonModule } from '@angular/common';
import { RelatedProdsComponent } from './related-prods/related-prods.component';
import { Product } from '../../../interfaces/product';
import { SignErrComponent } from '../../sign-err/sign-err.component';
import { ToolsService } from '../../services/tools.service';
import { ApiAreaService } from '../../services/api-area.service';
import { CartAreaService } from '../../services/cart-area.service';
import { CookieService } from 'ngx-cookie-service';
import { FALLBACK_PRODUCT_IMAGE, getProductImage, setFallbackProductImage } from '../../shared/product-image';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RelatedProdsComponent, SignErrComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  constructor(
    private actR: ActivatedRoute,
    private service: ProductsAreaService,
    public router: Router,
    public tools: ToolsService,
    private _cookie: CookieService,
    private apiArea: ApiAreaService,
    private cartServ: CartAreaService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getParam();
  }

  public prodID!: string;
  public prodINFO: any;
  public mainImage!: string;
  public allImages!: string[];
  public starNum!: number;
  public prodQuant: number = 1;
  @ViewChild("addShow") addShow!: ElementRef

  getParam() {
    this.actR.params.subscribe((data: Params) => {
      this.prodID = data['id'];
      this.prodQuant = 1;
      this.getFullInfoProduct(this.prodID);
    });
  }

  otherRelatedArea(pageID: string) {
    this.getFullInfoProduct(pageID);
  }

  getFullInfoProduct(pageID: string) {
    this.service.getProductDetailInfo(pageID).subscribe((data: Product) => {
      this.prodINFO = data;
      this.allImages = (data.images?.length ? data.images : [data.thumbnail]).filter(Boolean);
      if (!this.allImages.length) {
        this.allImages = [FALLBACK_PRODUCT_IMAGE];
      }
      this.mainImage = this.allImages[0];
      this.starNum = Math.round(data.rating);
    });
  }

  zoomImg(currImg: string) {
    this.mainImage = currImg;
  }

  increase() {
    this.prodQuant++;
  }

  decrease() {
    if (this.prodQuant > 1) {
      this.prodQuant--;
    }
  }

  errorSMS() {
    this.tools.isErrSMS.next(true);
  }

  cartBTN(id: string) {
    if (this._cookie.get("user")) {
      const prodInfoCart = {
        id: id,
        quantity: this.prodQuant,
      };

      this.apiArea.profileInfo().subscribe((data: any) => {
        data.cartID
          ? this.cartServ.addtoCart(prodInfoCart).subscribe()
          : this.cartServ.createCart(prodInfoCart).subscribe();
          this.renderer.setStyle(this.addShow.nativeElement, "bottom", "0")
          setTimeout(() => {
            this.renderer.setStyle(this.addShow.nativeElement, "bottom", "-100px")
          }, 2000);
      });
    }
    else {
      this.tools.isErrSMS.next(true)
    }
  }

  productImage(product: Product): string {
    return getProductImage(product);
  }

  onProductImageError(event: Event): void {
    setFallbackProductImage(event);
  }
}
