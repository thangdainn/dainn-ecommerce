import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] | undefined;
  user: User = new User();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.authService.emailSubject.subscribe((data) => {
      this.user.email = data;
    });
    this.authService.avatarSubject.subscribe((data) => {
      this.user.avatar = data;
    });
    this.authService.providerSubject.subscribe((data) => {
      this.user.provider = data;
      this.updateMenuItems();
    });
  }

  updateMenuItems() {
    const myAccountItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user-edit',
        routerLink: 'account/profile',
      }
    ];

    if (this.user.provider === 'local') {
      myAccountItems.push({
        label: 'Change Password',
        icon: 'pi pi-lock',
        routerLink: 'account/password',
      });
    }

    this.menuItems = [
      {
        label: 'My Account',
        icon: 'pi pi-user',
        routerLink: 'account/profile',
        items: myAccountItems
      },
      {
        label: 'My Purchase',
        icon: 'pi pi-inbox',
        routerLink: 'purchase',
      },
    ];
  }
}
