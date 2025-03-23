import { Component, OnInit } from '@angular/core';
import {
  format,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
  addDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { firstValueFrom } from 'rxjs';
import { Order } from 'src/app/common/order';
import { Product } from 'src/app/common/product';
import { AnalyticService } from 'src/app/services/analytic.service';
import { OrderService } from 'src/app/services/order.service';

interface RevenueData {
  date: Date;
  revenue: number;
}

interface SalesByCategoryData {
  category: string;
  quantity: number;
  revenue: number;
}

interface TopProduct {
  id: number;
  image: string;
  name: string;
  sold: number;
  revenue: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalRevenue: 0,
    avgOrderValue: 0,
    newOrders: 0,
    productSold: 0,
  };

  dateTypes: any[] = [
    { name: 'Weekly', value: 1 },
    { name: 'Monthly', value: 2 },
    { name: 'Yearly', value: 3 },
  ];
  selectedDateType: number = 2;

  dateRecentType: any[] = [
    { name: 'This week', value: 1 },
    { name: 'Last week', value: 2 },
    { name: 'Last month', value: 3 },
  ];
  selectedRecentDateType: number = 1;

  dateRanges: Date[] = [];

  rawRevenueData: RevenueData[] = [];
  revenueChartData: any;

  salesByCategoryData: SalesByCategoryData[] = [];
  salesByCategoryChart: any;

  topProducts: TopProduct[] = [];
  recentSales: Product[] = [];

  chartOptions: any;
  pieChartOptions: any;

  orderListDialog: boolean = false;
  orderList: Order[] = [];

  constructor(
    private analyticsService: AnalyticService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.setupChartOptions();
    this.initDateRange();
    this.loadData();
    this.loadRecentSales();
  }

  initDateRange() {
    this.dateRanges = [
      new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      new Date(),
    ];
  }

  loadRecentSales() {
    const { startDate, endDate } = this.calculateRecentDateRange();
    
    this.analyticsService.getRecentSales(startDate, endDate).subscribe((data) => {
      this.recentSales = data;
    });
  }

  calculateRecentDateRange(): { startDate: string, endDate: string } {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    if (this.selectedRecentDateType === 1) {
      startDate = startOfWeek(today, { weekStartsOn: 1 }); 
      endDate = endOfWeek(today, { weekStartsOn: 1 });

    } else if (this.selectedRecentDateType === 2) { 
      const lastWeek = subWeeks(today, 1);
      startDate = startOfWeek(lastWeek, { weekStartsOn: 1 });
      endDate = endOfWeek(lastWeek, { weekStartsOn: 1 });

    } else { 
      const lastMonth = subMonths(today, 1); 
      startDate = startOfMonth(lastMonth); 
      endDate = endOfMonth(lastMonth); 
    }

    return {
      startDate: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
      endDate: format(endDate, 'yyyy-MM-dd HH:mm:ss')
    };
  }

  setupChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.chartOptions = {
      plugins: {
        legend: { position: 'top' },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    this.pieChartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  applyDateRange() {
    if (!this.dateRanges) {
      this.initDateRange();
    } else if (this.dateRanges[0] && !this.dateRanges[1]) {
      this.dateRanges[1] = new Date();
    }
    this.loadData();
  }

  updateRevenueChartData() {
    let labels: string[] = [];
    let revenues: number[] = [];
    if (!this.selectedDateType) {
      this.selectedDateType = 2;
    }

    if (this.selectedDateType === 1) {
      // Weekly: Nhóm dữ liệu theo tuần
      const weeklyData = this.groupByWeek();
      labels = weeklyData.map((item) => `Week ${format(item.start, 'w')}`);
      revenues = weeklyData.map((item) => item.revenue);
    } else if (this.selectedDateType === 2) {
      // Monthly: Nhóm dữ liệu theo tháng
      const monthlyData = this.groupByMonth();
      labels = monthlyData.map((item) => format(item.start, 'MMM'));
      revenues = monthlyData.map((item) => item.revenue);
    } else {
      // Yearly: Nhóm dữ liệu theo năm
      const yearlyData = this.groupByYear();
      labels = yearlyData.map((item) => format(item.start, 'yyyy'));
      revenues = yearlyData.map((item) => item.revenue);
    }

    this.revenueChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenues,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
      ],
    };
  }

  groupByWeek() {
    const groups: { start: Date; revenue: number }[] = [];
    let currentDate = new Date(this.dateRanges[0]);
    const endDate = new Date(this.dateRanges[1]);

    while (currentDate <= endDate) {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Bắt đầu tuần từ thứ 2
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

      const weekRevenue = this.rawRevenueData
        .filter((item) => item.date >= weekStart && item.date <= weekEnd)
        .reduce((sum, item) => sum + item.revenue, 0);

      groups.push({ start: weekStart, revenue: weekRevenue });
      currentDate = addDays(weekEnd, 1);
    }

    return groups;
  }

  groupByMonth() {
    const groups: { start: Date; revenue: number }[] = [];
    let currentDate = new Date(this.dateRanges[0]);
    const endDate = new Date(this.dateRanges[1]);

    while (currentDate <= endDate) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const monthRevenue = this.rawRevenueData
        .filter((item) => item.date >= monthStart && item.date <= monthEnd)
        .reduce((sum, item) => sum + item.revenue, 0);

      groups.push({ start: monthStart, revenue: monthRevenue });
      currentDate = addDays(monthEnd, 1);
    }

    return groups;
  }

  groupByYear() {
    const groups: { start: Date; revenue: number }[] = [];
    let currentDate = new Date(this.dateRanges[0]);
    const endDate = new Date(this.dateRanges[1]);

    while (currentDate <= endDate) {
      const yearStart = startOfYear(currentDate);
      const yearEnd = endOfYear(currentDate);

      const yearRevenue = this.rawRevenueData
        .filter((item) => item.date >= yearStart && item.date <= yearEnd)
        .reduce((sum, item) => sum + item.revenue, 0);

      groups.push({ start: yearStart, revenue: yearRevenue });
      currentDate = addDays(yearEnd, 1);
    }

    return groups;
  }

  loadRevenueData(startDate: string, endDate: string) {
    this.analyticsService
      .getRevenueData(startDate, endDate)
      .subscribe((data) => {
        this.rawRevenueData = data.map((item: any) => ({
          date: new Date(item.date),
          revenue: item.revenue,
        }));

        this.updateRevenueChartData();
      });
  }

  async loadSalesByCategoryData(startDate: string, endDate: string) {
    this.salesByCategoryData = await firstValueFrom(
      this.analyticsService.getSalesByCategory(startDate, endDate)
    );

    this.salesByCategoryChart = {
      labels: this.salesByCategoryData.map((item) => item.category),
      datasets: [
        {
          data: this.salesByCategoryData.map((item) => item.quantity),
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'],
        },
      ],
    };
  }

  loadTopProductsData(startDate: string, endDate: string) {
    this.analyticsService.getTopProducts(startDate, endDate).subscribe((data) => {
      this.topProducts = data;
    });
  }

  getDateRange() {
    const fromDate = (this.dateRanges && this.dateRanges[0]) || null;
    const toDate = (this.dateRanges && this.dateRanges[1]) || null;

    const startDate = fromDate ? format(fromDate, 'yyyy-MM-dd HH:mm:ss') : '';
    const endDate = toDate ? format(toDate, 'yyyy-MM-dd HH:mm:ss') : '';
    return { startDate, endDate };
  }

  loadData() {
    const { startDate, endDate } = this.getDateRange();

    this.analyticsService.getStats(startDate, endDate).subscribe((data) => {
      this.stats = data;
      this.stats.avgOrderValue =
        this.stats.totalRevenue / this.stats.newOrders || 0;
    });

    this.loadRevenueData(startDate, endDate);

    this.loadSalesByCategoryData(startDate, endDate);

    this.loadTopProductsData(startDate, endDate);
  }

  showDialog(productId: number) {
    const { startDate, endDate } = this.getDateRange();
    this.loadOrderList(productId, startDate, endDate);
    this.orderListDialog = true;
  }

  hideDialog() {
    this.orderListDialog = false;
  }

  loadOrderList(productId: number, startDate: string, endDate: string) {
    this.orderService.getByProductId(productId, startDate, endDate).subscribe((data) => {
      this.orderList = data;
    })
  }
}
