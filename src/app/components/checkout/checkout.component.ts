import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderDetail } from 'src/app/common/order-detail';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { LocationService } from 'src/app/services/location.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  paymentMethods = ['Cash', 'VNPay'];

  provincesData: string = '';
  districtsData: string = '';
  wardsData: string = '';

  totalPrice: number = 0;
  totalQuantity: number = 0;
  deliveryFee: number = 0;
  discount: number = 0;

  userId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    this.authService.userIdSubject.subscribe((data) => {
      this.userId = data;
    });
    this.initFormGroups();
    
    this.loadProvinces();
  }

  initFormGroups() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        name: new FormControl('', [
          Validators.required,
          ShopValidators.notOnlyWhitespace,
        ]),
        phone: new FormControl('', [
          Validators.required,
          Validators.pattern(/^0\d{9}$/),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ]),
        note: new FormControl(''),
      }),
      shippingAddress: this.formBuilder.group({
        province: new FormControl('', [Validators.required]),
        district: new FormControl('', [Validators.required]),
        ward: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
      }),
      paymentMethod: new FormControl('', [Validators.required]),
    });
  }


  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });
  }

  loadProvinces() {
    this.locationService.getProvinces().subscribe((data) => {
      this.provinces = data.data;
    });
    this.districts = [];
    this.districtsData = '';
  }

  loadDistricts(provinceId: number) {
    this.locationService.getDistricts(provinceId).subscribe((data) => {
      this.districts = data.data;
    });
    this.wards = [];
    this.wardsData = '';
  }

  loadWards(districtId: number) {
    this.locationService.getWards(districtId).subscribe((data) => {
      this.wards = data.data;
    });
  }

  onProvinceChange(provinceEvent: any): void {
    const provinceId = provinceEvent.target.value;
    this.loadDistricts(provinceId);
    const province =
      provinceEvent.target.options[provinceEvent.target.options.selectedIndex]
        .text;
    this.provincesData = province;
  }

  onDistrictChange(districtEvent: any): void {
    const districtId = districtEvent.target.value;
    this.loadWards(districtId);
    const district =
      districtEvent.target.options[districtEvent.target.options.selectedIndex]
        .text;
    this.districtsData = district;
  }
  onWardChange(wardEvent: any): void {
    const ward =
      wardEvent.target.options[wardEvent.target.options.selectedIndex].text;
    this.wardsData = ward;
  }

  get name() {
    return this.checkoutFormGroup.get('customer.name');
  }

  get phone() {
    return this.checkoutFormGroup.get('customer.phone');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get address() {
    return this.checkoutFormGroup.get('shippingAddress.address');
  }

  get province() {
    return this.checkoutFormGroup.get('shippingAddress.province');
  }

  get district() {
    return this.checkoutFormGroup.get('shippingAddress.district');
  }

  get ward() {
    return this.checkoutFormGroup.get('shippingAddress.ward');
  }

  get paymentMethod() {
    return this.checkoutFormGroup.get('paymentMethod');
  }

  private getAddressDetail(): string {
    return (
      this.address?.value +
      ', ' +
      this.wardsData +
      ', ' +
      this.districtsData +
      ', ' +
      this.provincesData
    );
  }

  private createOrder(): Order {
    let order = new Order();
    order.userId = this.userId;
    order.customerName = this.name?.value;
    order.customerPhone = this.phone?.value;
    order.shippingAddress = this.getAddressDetail();
    order.paymentMethod = this.paymentMethod?.value;
    order.totalAmount = this.totalPrice;
    // order.deliveryFee = this.deliveryFee;
    // order.discount = this.discount;
    return order;
  }

  private createOrderDetail(): OrderDetail[] {
    const cartItems = this.cartService.carts;
    let orderDetails: OrderDetail[] = cartItems.map(
      (cartItem) => new OrderDetail(cartItem)
    );
    return orderDetails;
  }

  resetCart() {
    this.cartService.clearCart();
    this.checkoutFormGroup.reset();
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = this.createOrder();
    order.details = this.createOrderDetail();
    
    console.log(order);

    this.checkoutService.placeOrder(order).subscribe({
      next: (response) => {
        order = response;

        if (this.paymentMethod?.value === 'VNPay') {
          this.resetCart();
          this.paymentService.initVNPay(order).subscribe({
            next: (response) => {
              window.location.href = response.paymentUrl;
            },
            error: (err) => {
              alert(`There was an error: ${err.message}`);
            },
          });
        } else {
          this.resetCart();
          this.router.navigate(['order-status'], {
            queryParams: { vnp_TxnRef: order.id },
          });
        }
      },
      error: (err) => {
        alert(`There was an error: ${err.message}`);
      },
    });
  }

  
}
