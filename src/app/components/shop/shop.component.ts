import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from 'src/app/common/brand';
import { Category } from 'src/app/common/category';
import { Product } from 'src/app/common/product';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit{
  minValue: number = 0;
  maxValue: number = 20000;
  options: Options = {
    floor: 0,
    ceil: 30000,
    step: 500,
    noSwitching: true,
    showSelectionBar: true,
    getSelectionBarColor: (minValue: number, maxValue?: number) => '#dbcc8f',
    getPointerColor: (value: number) => '#dbcc8f',
  };
  isSubmitPrice: boolean = false;


  categories: Category[] = [];
  brands: Brand[] = [];

  categorySelections: {[key: number]: boolean} = {};
  brandSelections: {[key: number]: boolean} = {};

  products: Product[] = [];

  page: number = 1;
  size: number = 12;
  totalElements: number = 0;
  sortBy: string = 'Default Sorting';
  sortDir: string = 'asc';

  preKeyword: string = '';
  categoryIds: number[] = [];
  brandIds: number[] = [];

  

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.listProductCategories();
    this.listProductBrands();

    this.route.queryParams.subscribe(params => {
      this.handleSearch(params['keyword'] ? params['keyword'] : '');
    });
  }

  listProductBrands() {
    this.brandService.getBrands().subscribe((data) => {
      this.brands = data;
    });
  }

  listProductCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  handleSearch(keyword: string) {
    // if (keyword) {
      this.categoryIds = [];
      this.brandIds = [];
      this.sortBy = 'Default Sorting';
      this.sortDir = 'asc';
      this.page = 1;
      this.isSubmitPrice = false;
      this.resetSelections();
      this.preKeyword = keyword;
    // }
    this.handleProductsPaginate();
  }

  handleProductsPaginate() {
    this.route.queryParams.subscribe((params) => {
      if (params['keyword']) {
        const keyword = params['keyword'];
        if (this.preKeyword != keyword) {
          this.page = 1;
          this.preKeyword = keyword;
        }
      }
    });
    this.productService
      .getProductsPaginate(this.page - 1, this.size, this.sortBy, this.sortDir,
                          this.preKeyword, this.categoryIds, this.brandIds,
                          this.minValue * 1000, this.maxValue * 1000, this.isSubmitPrice)
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.products = data.data;
      this.page = data.page + 1;
      this.size = data.size;
      this.totalElements = data.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.size = +pageSize;
    this.page = 1;
    this.handleProductsPaginate();
  }

  sortingType(sortType: string) {
    this.sortBy = sortType;
    this.page = 1;
    this.handleProductsPaginate();
  }

  onCbCateChange(e: any, categoryId: number){
    this.categorySelections[categoryId] = e.target.checked;
    if (e.target.checked) {
      this.categoryIds.push(e.target.value);
    } else {
      // tạo 1 mảng mới không chứa id vừa bỏ check
      this.categoryIds = this.categoryIds.filter((id) => id !== e.target.value);
    }
    this.handleProductsPaginate();
  }
  onCbBrandChange(e: any, brandId: number){
    this.brandSelections[brandId] = e.target.checked;
    if (e.target.checked) {
      this.brandIds.push(e.target.value);
    } else {
      // tạo 1 mảng mới không chứa id vừa bỏ check
      this.brandIds = this.brandIds.filter((id) => id !== e.target.value);
    }
    this.handleProductsPaginate();
  }

  


  submitPriceRange() {
    this.isSubmitPrice = true;
    this.handleProductsPaginate();
  }

  resetSelections() {
    Object.keys(this.categorySelections).forEach(key => {
      // @ts-ignore
      this.categorySelections[key] = false;
    });
    Object.keys(this.brandSelections).forEach(key => {
      // @ts-ignore
      this.brandSelections[key] = false;
    });
  }
}
