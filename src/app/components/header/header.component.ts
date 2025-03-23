import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  totalQuantity: number = 0;
  socketClient: any = null;

  private notificationSubscription: any;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateCartStatus();

    // let ws = new SockJS('http://localhost:8090/api/ws');
    // this.socketClient = Stomp.over(ws);

    // this.socketClient.connect(
    //   { Authorization: 'Bearer ' + localStorage.getItem('token') },
    //   () => {
    //     console.log('Connected to the server');
    //     this.notificationSubscription = this.socketClient.subscribe(
    //       `/user/${this.authService.userIdSubject.value}/notifications`,
    //       (message: any) => {
    //         console.log('Received message: ' + message);
    //       }
    //     );
    //   },
    //   (error: any) => {
    //     console.log('Cannot connect to the server: ' + error);
    //   }
    // );
  }

  updateCartStatus() {
    this.cartService.totalQuantity.subscribe((totalQuantity) => {
      this.totalQuantity = totalQuantity;
    });
    this.authService.roleSubject.subscribe((role) => {
      if (role === 'ROLE_USER') {
        this.cartService.getCountCartItems().subscribe((totalQuantity) => {
          this.totalQuantity = totalQuantity;
          this.cartService.totalQuantity.next(totalQuantity);
        });
      }
    });
    
    // this.authService.isAuthenticatedSubject.subscribe((isAuthenticated) => {
    //   if (!isAuthenticated) {
    //     this.cartService.totalQuantity.subscribe((totalQuantity) => {
    //       this.totalQuantity = totalQuantity;
    //     });
    //   }
    // });

    // this.authService.isAuthenticatedSubject.subscribe((isAuthenticated) => {
    //   console.log('isAuthenticated: ' + isAuthenticated);

    //   if (isAuthenticated && this.authService.roleSubject.value === 'ROLE_USER') {
    //     console.log('Role: ' + this.authService.roleSubject.value);

    //     this.cartService.getCountCartItems().subscribe((totalQuantity) => {
    //       this.totalQuantity = totalQuantity;
    //       this.cartService.totalQuantity.next(totalQuantity);
    //     });
    //   } else {
    //     this.cartService.totalQuantity.subscribe((totalQuantity) => {
    //       this.totalQuantity = totalQuantity;
    //     });
    //   }
    // });
  }
}
