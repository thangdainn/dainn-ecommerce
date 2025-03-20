import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailAdComponent } from './product-detail-ad.component';

describe('ProductDetailAdComponent', () => {
  let component: ProductDetailAdComponent;
  let fixture: ComponentFixture<ProductDetailAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductDetailAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
