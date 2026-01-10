import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Layout } from '../shared/layout/layout';

interface Payout {
    id: number;
    writer_name: string;
    writer_email: string;
    amount: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    requested_at: string;
    processed_at?: string;
    payment_method: string;
    payment_details: string;
    failure_reason?: string;
}

@Component({
    selector: 'app-payouts',
    imports: [FormsModule, CommonModule, Layout],
    templateUrl: './payouts.html',
    styleUrl: './payouts.css',
})
export class Payouts implements OnInit {
    payouts: Payout[] = [];
    filteredPayouts: Payout[] = [];
    searchTerm = '';
    selectedFilter = 'All Payouts';
    isLoading = false;
    userRole: string | null = null;
    totalPendingAmount = 0;
    totalProcessedAmount = 0;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.userRole = this.authService.getUserRole();
        this.loadPayouts();
    }

    loadPayouts(): void {
        this.isLoading = true;
        // Mock data - replace with actual API call
        setTimeout(() => {
            this.payouts = [
                {
                    id: 1,
                    writer_name: 'Sarah Wilson',
                    writer_email: 'sarah@example.com',
                    amount: '250.00',
                    status: 'pending',
                    requested_at: '2025-01-01T10:00:00Z',
                    payment_method: 'PayPal',
                    payment_details: 'sarah.wilson@paypal.com'
                },
                {
                    id: 2,
                    writer_name: 'Emma Davis',
                    writer_email: 'emma@example.com',
                    amount: '180.50',
                    status: 'completed',
                    requested_at: '2024-12-28T14:30:00Z',
                    processed_at: '2024-12-29T09:15:00Z',
                    payment_method: 'Bank Transfer',
                    payment_details: 'Account ending in 1234'
                },
                {
                    id: 3,
                    writer_name: 'Mike Johnson',
                    writer_email: 'mike@example.com',
                    amount: '95.75',
                    status: 'failed',
                    requested_at: '2024-12-30T16:20:00Z',
                    payment_method: 'PayPal',
                    payment_details: 'mike.j@paypal.com',
                    failure_reason: 'Invalid PayPal account'
                },
                {
                    id: 4,
                    writer_name: 'Lisa Chen',
                    writer_email: 'lisa@example.com',
                    amount: '320.00',
                    status: 'processing',
                    requested_at: '2024-12-31T11:45:00Z',
                    payment_method: 'Bank Transfer',
                    payment_details: 'Account ending in 5678'
                }
            ];
            this.filteredPayouts = [...this.payouts];
            this.calculateTotals();
            this.isLoading = false;
        }, 1000);
    }

    private calculateTotals(): void {
        this.totalPendingAmount = this.payouts
            .filter(p => p.status === 'pending' || p.status === 'processing')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);

        this.totalProcessedAmount = this.payouts
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    }

    onSearch(): void {
        this.applyFilters();
    }

    onFilterChange(): void {
        this.applyFilters();
    }

    private applyFilters(): void {
        let filtered = [...this.payouts];

        // Apply search filter
        if (this.searchTerm.trim()) {
            filtered = filtered.filter(payout =>
                payout.writer_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                payout.writer_email.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        switch (this.selectedFilter) {
            case 'Pending':
                filtered = filtered.filter(payout => payout.status === 'pending');
                break;
            case 'Processing':
                filtered = filtered.filter(payout => payout.status === 'processing');
                break;
            case 'Completed':
                filtered = filtered.filter(payout => payout.status === 'completed');
                break;
            case 'Failed':
                filtered = filtered.filter(payout => payout.status === 'failed');
                break;
        }

        this.filteredPayouts = filtered;
    }

    onApprovePayout(payout: Payout): void {
        console.log('Approve payout:', payout);
        payout.status = 'processing';
        this.calculateTotals();
        this.applyFilters();
    }

    onRejectPayout(payout: Payout): void {
        console.log('Reject payout:', payout);
        payout.status = 'failed';
        payout.failure_reason = 'Rejected by admin';
        this.calculateTotals();
        this.applyFilters();
    }

    onMarkCompleted(payout: Payout): void {
        console.log('Mark payout as completed:', payout);
        payout.status = 'completed';
        payout.processed_at = new Date().toISOString();
        this.calculateTotals();
        this.applyFilters();
    }

    onRetryPayout(payout: Payout): void {
        console.log('Retry payout:', payout);
        payout.status = 'pending';
        payout.failure_reason = undefined;
        this.calculateTotals();
        this.applyFilters();
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'processing': return 'bg-info';
            case 'completed': return 'bg-success';
            case 'failed': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    getStatusText(status: string): string {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    getPaymentMethodIcon(method: string): string {
        switch (method.toLowerCase()) {
            case 'paypal': return 'pi-paypal';
            case 'bank transfer': return 'pi-building';
            case 'stripe': return 'pi-credit-card';
            default: return 'pi-wallet';
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    formatDateTime(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }

    formatCurrency(amount: string): string {
        return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
}