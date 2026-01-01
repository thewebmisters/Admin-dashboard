import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface ChatData {
    id: number;
    user_name: string;
    writer_name: string | null;
    status: 'active' | 'pending' | 'completed' | 'flagged';
    messages_count: number;
    last_message_at: string;
    created_at: string;
    flagged_reason?: string;
}

@Component({
    selector: 'app-chat',
    imports: [FormsModule, CommonModule],
    templateUrl: './chat.html',
    styleUrl: './chat.css',
})
export class Chat implements OnInit {
    chats: ChatData[] = [];
    filteredChats: ChatData[] = [];
    searchTerm = '';
    selectedFilter = 'All Chats';
    isLoading = false;
    userRole: string | null = null;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.userRole = this.authService.getUserRole();
        this.loadChats();
    }

    loadChats(): void {
        this.isLoading = true;
        // Mock data - replace with actual API call
        setTimeout(() => {
            this.chats = [
                {
                    id: 1,
                    user_name: 'John Doe',
                    writer_name: 'Sarah Wilson',
                    status: 'active',
                    messages_count: 25,
                    last_message_at: '2025-01-01T10:30:00Z',
                    created_at: '2024-12-28T14:20:00Z'
                },
                {
                    id: 2,
                    user_name: 'Maria Garcia',
                    writer_name: null,
                    status: 'pending',
                    messages_count: 3,
                    last_message_at: '2025-01-01T09:15:00Z',
                    created_at: '2025-01-01T09:00:00Z'
                },
                {
                    id: 3,
                    user_name: 'Mike Johnson',
                    writer_name: 'Emma Davis',
                    status: 'flagged',
                    messages_count: 45,
                    last_message_at: '2024-12-31T18:45:00Z',
                    created_at: '2024-12-25T11:30:00Z',
                    flagged_reason: 'Inappropriate content reported'
                }
            ];
            this.filteredChats = [...this.chats];
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
        let filtered = [...this.chats];

        // Apply search filter
        if (this.searchTerm.trim()) {
            filtered = filtered.filter(chat =>
                chat.user_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                (chat.writer_name && chat.writer_name.toLowerCase().includes(this.searchTerm.toLowerCase()))
            );
        }

        // Apply status filter
        switch (this.selectedFilter) {
            case 'Active':
                filtered = filtered.filter(chat => chat.status === 'active');
                break;
            case 'Pending':
                filtered = filtered.filter(chat => chat.status === 'pending');
                break;
            case 'Flagged':
                filtered = filtered.filter(chat => chat.status === 'flagged');
                break;
            case 'Completed':
                filtered = filtered.filter(chat => chat.status === 'completed');
                break;
        }

        this.filteredChats = filtered;
    }

    onViewChat(chat: ChatData): void {
        console.log('View chat:', chat);
        // Navigate to chat details
    }

    onAssignWriter(chat: ChatData): void {
        console.log('Assign writer to chat:', chat);
        // Open writer assignment modal
    }

    onFlagChat(chat: ChatData): void {
        console.log('Flag chat:', chat);
        // Open flag chat modal
    }

    onResolveFlag(chat: ChatData): void {
        console.log('Resolve flag for chat:', chat);
        chat.status = 'active';
        this.applyFilters();
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'active': return 'bg-success';
            case 'pending': return 'bg-warning';
            case 'flagged': return 'bg-danger';
            case 'completed': return 'bg-secondary';
            default: return 'bg-secondary';
        }
    }

    getStatusText(status: string): string {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    formatDateTime(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }
}