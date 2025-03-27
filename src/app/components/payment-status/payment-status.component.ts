import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';

interface TransactionStatus {
  orderType: string;
  amount: number;
  partnerCode: string;
  orderId: string;
  extraData: string;
  signature: string;
  transId: string;
  responseTime: string;
  message: string;
  payType: string;
  requestId: string;
  orderInfo: string;
}

interface CallbackResponse {
  transactionCode: string;
  orderId: number;
}

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css'],
})
export class PaymentStatusComponent implements OnInit {
  message: string = '';
  subMessage: string = 'Thank you for your order !';

  transactionStatus!: TransactionStatus;
  callbackResponse: CallbackResponse = {
    transactionCode: '27',
    orderId: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');
    if (type == 'mono') {
      this.initPaymentCallback();
    } else {
      this.route.queryParams.subscribe((params) => {
        console.log(params);
      });
    }
    this.message = this.setStatusMessage(this.callbackResponse.transactionCode);
  }

  async initPaymentCallback() {
    this.route.queryParams.subscribe((params) => {
      this.transactionStatus = {
        orderType: params['orderType'],
        amount: params['amount'],
        partnerCode: params['partnerCode'],
        orderId: params['orderId'],
        extraData: params['extraData'],
        signature: params['signature'],
        transId: params['transId'],
        responseTime: params['responseTime'],
        message: params['message'],
        payType: params['payType'],
        requestId: params['requestId'],
        orderInfo: params['orderInfo'],
      };
    });

    this.callbackResponse = await firstValueFrom(
      this.paymentService.callbackMono(this.transactionStatus)
    );
    
  }

  setStatusMessage(transactionCode: string): string {
      console.log(transactionCode);
  
      if (transactionCode == '27') {
        return 'Order successfully';
      } else if (transactionCode == '00') {
        return 'Payment successful';
      } else {
        this.subMessage = 'Try again later.';
        return 'Payment failed';
      }
    }

  // restoreAuthState() {
  //   const token = this.authService.getToken();
  //   if (token) {
  //     this.authService.setAuthenticationStatus(token);
  //   }
  // }
}
