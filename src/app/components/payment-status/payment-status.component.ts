import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.transactionCode = params['vnp_ResponseCode'];
      this.orderId = params['vnp_TxnRef'];
    });
    this.restoreAuthState();
    this.message = this.setStatusMessage(this.transactionCode);
  }

  setStatusMessage(transactionCode: string): string {
    if (transactionCode == undefined) {
      return 'Order successfully';
    } else if (transactionCode == '00') {
      return 'Payment successful';
    } else {
      this.subMessage = 'Try again later.';
      return 'Payment failed';
    }
  }

  restoreAuthState(){
    const token = this.authService.getToken();
    if (token) {
      this.authService.setAuthenticationStatus(token);
    }
  }
}
