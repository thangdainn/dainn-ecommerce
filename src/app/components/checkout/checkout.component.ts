import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from 'src/app/common/cart';
import { Order } from 'src/app/common/order';
import { OrderDetail } from 'src/app/common/order-detail';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { LocationService } from 'src/app/services/location.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  items: Cart[] = [];

  checkoutFormGroup!: FormGroup;

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  paymentMethods = ['Cash', 'VNPay', 'Momo'];

  provincesData: string = '';
  districtsData: string = '';
  wardsData: string = '';

  isLoadingProvince: boolean = false;
  isLoadingDistrict: boolean = false;
  isLoadingWard: boolean = false;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  deliveryFee: number = 0;
  discount: number = 0;

  userId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.items = navigation.extras.state['items'];
    } else {
      this.router.navigate(['/cart']);
    }
  }

  ngOnInit(): void {
    this.computeFee();

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

  computeFee() {
    console.log(this.items);
    for (let item of this.items) {
      this.totalQuantity += item.quantity;
      this.totalPrice += item.quantity * item.product.price;
    }
  }


  loadProvinces() {
    this.isLoadingProvince = true;
    this.locationService.getProvinces().subscribe((data) => {
      this.provinces = data.data;
      this.isLoadingProvince = false;
    });
    this.districts = [];
    this.districtsData = '';
  }

  loadDistricts(provinceId: number) {
    this.isLoadingDistrict = true;
    this.locationService.getDistricts(provinceId).subscribe((data) => {
      this.districts = data.data;
      this.isLoadingDistrict = false
    });
    this.wards = [];
    this.wardsData = '';
  }

  loadWards(districtId: number) {
    this.isLoadingWard = true;
    this.locationService.getWards(districtId).subscribe((data) => {
      this.wards = data.data;
      this.isLoadingWard = false;
    });
  }

  onProvinceChange(provinceEvent: any): void {
    const provinceId = provinceEvent.value.id;
    this.loadDistricts(provinceId);
    
    this.provincesData = provinceEvent.value.name;
  }

  onDistrictChange(districtEvent: any): void {
    const districtId = districtEvent.value.id;
    this.loadWards(districtId);
  
    this.districtsData = districtEvent.value.name;
  }

  onWardChange(wardEvent: any): void {
    this.wardsData = wardEvent.value.name;
  }

  onlyNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
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
    order.status = 'PROCESSING';
    // order.deliveryFee = this.deliveryFee;
    // order.discount = this.discount;
    return order;
  }

  private createOrderDetail(): OrderDetail[] {
    let orderDetails: OrderDetail[] = this.items.map(
      (cartItem) => new OrderDetail(cartItem)
    );
    return orderDetails;
  }

  resetCart() {
    this.cartService.removeItems(this.items);
    this.checkoutFormGroup.reset();
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = this.createOrder();
    order.details = this.createOrderDetail();

    this.orderService.placeOrder(order).subscribe({
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

        } else if (this.paymentMethod?.value === 'Momo') {
          this.resetCart();
          this.paymentService.initMomo(order).subscribe({
            next: (response) => {
              window.location.href = response.payUrl;
            },
            error: (err) => {
              alert(`There was an error: ${err.message}`);
            },
          });

        } else {
          this.resetCart();
          this.router.navigate(['order-status'], {
            queryParams: { orderId: order.id },
          });
        }
      },
      error: (err) => {
        alert(`There was an error: ${err.message}`);
      },
    });
  }
}
