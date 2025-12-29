import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthService } from '../../services/auth.service';
import { AdminAnalytics, UserAnalytics, WriterAnalytics, ChartData } from '../../models/analytics.model';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit {
    @ViewChild('revenueChart', { static: false }) revenueChart!: ElementRef<HTMLCanvasElement>;

    // Analytics data
    adminStats: AdminAnalytics | null = null;
    userStats: UserAnalytics | null = null;
    writerStats: WriterAnalytics | null = null;
    chartData: ChartData | null = null;

    // UI state
    isLoading = true;
    userRole: string | null = null;

    // Chart instance
    private chart: Chart | null = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private analyticsService: AnalyticsService,
        private authService: AuthService,
        private router: Router
    ) {
        if (isPlatformBrowser(this.platformId)) {
            Chart.register(...registerables);
        }
    }

    ngOnInit(): void {
        this.userRole = this.authService.getUserRole();
        this.loadAnalytics();
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.loadChartData();
        }
    }

    private loadAnalytics(): void {
        this.isLoading = true;

        if (this.userRole === 'admin') {
            this.analyticsService.getAdminAnalytics().subscribe({
                next: (response) => {
                    this.adminStats = response.data;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading admin analytics:', error);
                    this.isLoading = false;
                }
            });
        } else if (this.userRole === 'writer') {
            this.analyticsService.getWriterAnalytics().subscribe({
                next: (response) => {
                    this.writerStats = response.data;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading writer analytics:', error);
                    this.isLoading = false;
                }
            });
        } else {
            this.analyticsService.getUserAnalytics().subscribe({
                next: (response) => {
                    this.userStats = response.data;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading user analytics:', error);
                    this.isLoading = false;
                }
            });
        }
    }

    private loadChartData(): void {
        if (this.userRole === 'admin') {
            // For admin, we'll use a mock chart or create a different chart
            this.initChart();
        } else if (this.userRole === 'writer') {
            this.analyticsService.getWriterEarningsChart().subscribe({
                next: (response) => {
                    this.chartData = response.data;
                    this.initChart();
                },
                error: (error) => {
                    console.error('Error loading writer chart data:', error);
                    this.initChart(); // Initialize with default data
                }
            });
        } else {
            this.analyticsService.getUserSpendingChart().subscribe({
                next: (response) => {
                    this.chartData = response.data;
                    this.initChart();
                },
                error: (error) => {
                    console.error('Error loading user chart data:', error);
                    this.initChart(); // Initialize with default data
                }
            });
        }
    }

    private initChart(): void {
        const ctx = this.revenueChart?.nativeElement?.getContext('2d');
        if (ctx) {
            // Destroy existing chart if it exists
            if (this.chart) {
                this.chart.destroy();
            }

            const labels = this.chartData?.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
            let data: number[] = [];
            let label = '';

            if (this.userRole === 'writer' && this.chartData?.earnings) {
                data = this.chartData.earnings;
                label = 'Earnings ($)';
            } else if (this.userRole === 'user' && this.chartData?.spending) {
                data = this.chartData.spending;
                label = 'Spending ($)';
            } else {
                // Default data for admin or fallback
                data = [1200, 1900, 3000, 5000, 2300, 3200];
                label = 'Revenue ($)';
            }

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: label,
                            data: data,
                            borderColor: 'rgb(79, 70, 229)',
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            tension: 0.1,
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
                        },
                        x: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                    },
                },
            });
        }
    }

    // Get stats based on user role
    getStats() {
        if (this.userRole === 'admin' && this.adminStats) {
            return {
                totalRevenue: `$${this.adminStats.total_revenue}`,
                activeUsers: this.adminStats.active_users.toString(),
                pendingReports: this.adminStats.pending_reports.toString(),
                totalMessages: this.adminStats.total_messages.toString()
            };
        } else if (this.userRole === 'writer' && this.writerStats) {
            return {
                totalRevenue: `$${this.writerStats.total_earnings}`,
                activeUsers: this.writerStats.active_chats.toString(),
                pendingReports: this.writerStats.available_chats.toString(),
                totalMessages: this.writerStats.messages_sent.toString()
            };
        } else if (this.userRole === 'user' && this.userStats) {
            return {
                totalRevenue: `$${this.userStats.total_spending}`,
                activeUsers: this.userStats.current_balance.toString(),
                pendingReports: this.userStats.active_chats.toString(),
                totalMessages: this.userStats.messages_sent.toString()
            };
        }

        // Fallback stats
        return {
            totalRevenue: '$12,450.00',
            activeUsers: '1,280',
            pendingReports: '15',
            totalMessages: '28,900'
        };
    }

    // Get stat labels based on user role
    getStatLabels() {
        if (this.userRole === 'admin') {
            return {
                label1: 'Total Revenue',
                label2: 'Active Users',
                label3: 'Pending Reports',
                label4: 'Total Messages'
            };
        } else if (this.userRole === 'writer') {
            return {
                label1: 'Total Earnings',
                label2: 'Active Chats',
                label3: 'Available Chats',
                label4: 'Messages Sent'
            };
        } else {
            return {
                label1: 'Total Spending',
                label2: 'Token Balance',
                label3: 'Active Chats',
                label4: 'Messages Sent'
            };
        }
    }

    onNavigate(route: string): void {
        // Handle navigation logic here
        console.log('Navigate to:', route);
        this.router.navigate([`/${route}`]);
    }

    onLogout(): void {
        this.authService.logout();
        // Navigation will be handled by auth guard or app component
        console.log('Logout clicked');
    }

    refreshData(): void {
        this.loadAnalytics();
        this.loadChartData();
    }
}