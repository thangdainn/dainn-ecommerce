import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css'],
})
export class PaymentStatusComponent implements OnInit {
  transactionCode: string = '';
  orderId: number = 0;
  message: string = '';
  subMessage: string = 'Thank you for your order !';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.transactionCode = params['vnp_ResponseCode'];
      this.orderId = params['vnp_TxnRef'];
    });
    if (this.transactionCode == undefined) {
      this.message = 'Order successfully';
    } else if (this.transactionCode == '00') {
      this.message = 'Payment successful';
    } else {
      this.message = 'Payment failed';
      this.subMessage = 'Try again later.';
    }
  }
}
