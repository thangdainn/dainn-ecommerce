import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
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
            label: 'Products',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: '/admin/products',
          },
          {
            label: 'Categories',
            icon: 'pi pi-fw pi-folder',
            routerLink: '/admin/categories',
          },
          {
            label: 'Orders',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: '/admin/orders',
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
            routerLink: '/logout',
          },
        ],
      },
      {
        separator: true,
      },
    ];
  }
}
