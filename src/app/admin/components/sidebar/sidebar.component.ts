import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] | undefined;
  name: string = '';
  role: string = '';

  storage: Storage = localStorage;

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit() {
    this.authService.loggedUserSubject.subscribe((data) => {
      this.name = data;
    });

    this.authService.roleSubject.subscribe((data) => {
      this.role = data;
    });

    this.items = [
      {
        separator: true,
      },
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: '/admin/dashboard',
          },
        ],
      },
      {
        label: 'Management',
        items: [
          {
            label: 'Roles',
            icon: 'pi pi-fw pi-users',
            routerLink: '/admin/roles',
          },
          {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            routerLink: '/admin/users',
          },
          {
            label: 'Orders',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: '/admin/orders',
          },
          {
            label: 'Products',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: '/admin/products',
          },
          {
            label: 'Sizes',
            icon: 'pi pi-fw pi-cog',
            routerLink: '/admin/sizes',
          },
          {
            label: 'Brands',
            icon: 'pi pi-fw pi-tags',
            routerLink: '/admin/brands',
          },
          {
            label: 'Categories',
            icon: 'pi pi-fw pi-folder',
            routerLink: '/admin/categories',
          },
        ],
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: '2',
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
      {
        separator: true,
      },
    ];
  }

  logout(): void {
    this.authService.logout();
    this.storage.removeItem(this.authService.token);
    this.authService.loggedUserSubject.next('');
    this.authService.isAuthenticatedSubject.next(false);
    this.authService.userIdSubject.next(0);
    this.route.navigate(['/login']);
  }
}
