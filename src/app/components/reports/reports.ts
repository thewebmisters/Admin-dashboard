import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Report {
    id: number;
    reporter_name: string;
    reported_user: string;
    type: 'inappropriate_content' | 'harassment' | 'spam' | 'fake_profile' | 'other';
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    description: string;
    created_at: string;
    resolved_at?: string;
    admin_notes?: string;
}

@Component({
    selector: 'app-reports',
    imports: [FormsModule, CommonModule],
    templateUrl: './reports.html',
    styleUrl: './reports.css',
})
export class Reports implements OnInit {
    reports: Report[] = [];
    filteredReports: Report[] = [];
    searchTerm = '';
    selectedFilter = 'All Reports';
    isLoading = false;
    userRole: string | null = null;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.userRole = this.authService.getUserRole();
        this.loadReports();
    }

    loadReports(): void {
        this.isLoading = true;
        // Mock data - replace with actual API call
        setTimeout(() => {
            this.reports = [
                {
                    id: 1,
                    reporter_name: 'John Doe',
                    reported_user: 'BadUser123',
                    type: 'inappropriate_content',
                    status: 'pending',
                    description: 'User sent inappropriate messages during chat session',
                    created_at: '2025-01-01T10:00:00Z'
                },
                {
                    id: 2,
                    reporter_name: 'Sarah Wilson',
                    reported_user: 'SpamBot456',
                    type: 'spam',
                    status: 'resolved',
                    description: 'User was sending spam messages repeatedly',
                    created_at: '2024-12-30T14:30:00Z',
                    resolved_at: '2024-12-31T09:15:00Z',
                    admin_notes: 'User account suspended for 7 days'
                },
                {
                    id: 3,
                    reporter_name: 'Mike Johnson',
                    reported_user: 'FakeProfile789',
                    type: 'fake_profile',
                    status: 'investigating',
                    description: 'Profile appears to be using stolen photos',
                    created_at: '2024-12-29T16:20:00Z'
                }
            ];
            this.filteredReports = [...this.reports];
            this.isLoading = false;
        }, 1000);
    }

    onSearch(): void {
        this.applyFilters();
    }

    onFilterChange(): void {
        this.applyFilters();
    }

    private applyFilters(): void {
        let filtered = [...this.reports];

        // Apply search filter
        if (this.searchTerm.trim()) {
            filtered = filtered.filter(report =>
                report.reporter_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                report.reported_user.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                report.description.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        switch (this.selectedFilter) {
            case 'Pending':
                filtered = filtered.filter(report => report.status === 'pending');
                break;
            case 'Investigating':
                filtered = filtered.filter(report => report.status === 'investigating');
                break;
            case 'Resolved':
                filtered = filtered.filter(report => report.status === 'resolved');
                break;
            case 'Dismissed':
                filtered = filtered.filter(report => report.status === 'dismissed');
                break;
        }

        this.filteredReports = filtered;
    }

    onViewReport(report: Report): void {
        console.log('View report:', report);
        // Open report details modal
    }

    onStartInvestigation(report: Report): void {
        console.log('Start investigation:', report);
        report.status = 'investigating';
        this.applyFilters();
    }

    onResolveReport(report: Report): void {
        console.log('Resolve report:', report);
        report.status = 'resolved';
        report.resolved_at = new Date().toISOString();
        this.applyFilters();
    }

    onDismissReport(report: Report): void {
        console.log('Dismiss report:', report);
        report.status = 'dismissed';
        report.resolved_at = new Date().toISOString();
        this.applyFilters();
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'investigating': return 'bg-info';
            case 'resolved': return 'bg-success';
            case 'dismissed': return 'bg-secondary';
            default: return 'bg-secondary';
        }
    }

    getTypeClass(type: string): string {
        switch (type) {
            case 'inappropriate_content': return 'text-danger';
            case 'harassment': return 'text-danger';
            case 'spam': return 'text-warning';
            case 'fake_profile': return 'text-info';
            case 'other': return 'text-secondary';
            default: return 'text-secondary';
        }
    }

    getTypeIcon(type: string): string {
        switch (type) {
            case 'inappropriate_content': return 'pi-exclamation-triangle';
            case 'harassment': return 'pi-ban';
            case 'spam': return 'pi-envelope';
            case 'fake_profile': return 'pi-user-minus';
            case 'other': return 'pi-info-circle';
            default: return 'pi-info-circle';
        }
    }

    getStatusText(status: string): string {
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }

    getTypeText(type: string): string {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    formatDateTime(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }
}