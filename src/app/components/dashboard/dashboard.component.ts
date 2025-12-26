import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    template: `
    <div>
      <h1>Dashboard</h1>
      <p>Total Revenue: {{ stats.totalRevenue }}</p>
      <button (click)="onNavigate('test')">Test Navigation</button>
    </div>
  `,
    styleUrl: './dashboard.css',
})
export class Dashboard {
    stats = {
        totalRevenue: '$12,450.00',
        activeUsers: '1,280',
        pendingPayouts: '$975.50',
        flaggedChats: 15
    };

    onNavigate(route: string): void {
        console.log('Navigate to:', route);
    }

    onLogout(): void {
        console.log('Logout clicked');
    }
}