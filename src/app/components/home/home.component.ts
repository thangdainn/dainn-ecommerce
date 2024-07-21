import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  bannerOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    margin: 0,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    nav: false,
    dots: false,
    autoplayHoverPause: false,
    items: 1,
    navText: [
      "<span class='ion-md-arrow-back'></span>",
      "<span class='ion-chevron-right'></span>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };
  feedBackOptions: OwlOptions = {
    center: true,
    loop: true,
    // items: 1,
	  dots: true,
    margin: 30,
    stagePadding: 0,
    nav: false,
    navText: [
      '<span class="ion-ios-arrow-back">',
      '<span class="ion-ios-arrow-forward">',
    ],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };

  ngOnInit(): void {
    this.getTop10LeastProducts();
  }

  getTop10LeastProducts() {
    this.productService.getTop10LeastProducts().subscribe((data) => {
      this.products = data.data;
    });
  }
  

  banners = [
	'assets/images/bg_1.png',
	'assets/images/bg_2.png'
	];


}
