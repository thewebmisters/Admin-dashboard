
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User, UserStats, UserFilters } from '../../models/user.model';

@Component({
  selector: 'app-users',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: User[] = [];
  userStats: UserStats | null = null;
  isLoading = true;
  isLoadingStats = true;
  isUpdating = false;

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalUsers = 0;
  perPage = 10;

  // Filters
  searchTerm = '';
  statusFilter = 'all';
  verificationFilter = 'all';
  roleFilter = 'all';
  sortBy = 'created_at';
  sortOrder = 'desc';

  // Modal states
  showUserModal = false;
  showSuspendModal = false;
  showDeleteModal = false;
  selectedUser: User | null = null;

  // Forms
  suspendForm: FormGroup;
  notificationForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.suspendForm = this.formBuilder.group({
      reason: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.notificationForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserStats();
  }

  loadUsers(): void {
    this.isLoading = true;
    const filters: UserFilters = {
      search: this.searchTerm || undefined,
      status: this.statusFilter as any,
      verification: this.verificationFilter as any,
      role: this.roleFilter as any,
      sort_by: this.sortBy as any,
      sort_order: this.sortOrder as any,
      page: this.currentPage,
      per_page: this.perPage
    };

    this.userService.getUsers(filters).subscribe({
      next: (response: any) => {
        this.users = response.data.data || response.data || [];
        if (response.data.meta) {
          this.currentPage = response.data.meta.current_page;
          this.totalPages = response.data.meta.last_page;
          this.totalUsers = response.data.meta.total;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users',
          life: 3000
        });
        this.isLoading = false;
        // Use fallback data for demo
        this.loadFallbackData();
      }
    });
  }

  loadUserStats(): void {
    this.isLoadingStats = true;
    this.userService.getUserStats().subscribe({
      next: (response: any) => {
        this.userStats = response.data;
        this.isLoadingStats = false;
      },
      error: (error: any) => {
        console.error('Error loading user stats:', error);
        this.isLoadingStats = false;
        // Use fallback stats
        this.userStats = {
          total_users: this.users.length,
          active_users: this.users.filter(u => u.is_active).length,
          suspended_users: this.users.filter(u => u.is_suspended).length,
          verified_users: this.users.filter(u => u.verification_status === 'verified').length,
          pending_verification: this.users.filter(u => u.verification_status === 'pending').length,
          new_users_today: 5,
          new_users_this_week: 23,
          new_users_this_month: 87
        };
      }
    });
  }

  private loadFallbackData(): void {
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        email_verified_at: '2025-01-01T10:00:00Z',
        phone: '+1234567890',
        phone_verified_at: '2025-01-01T10:00:00Z',
        bio: 'Software developer',
        interests: ['coding', 'music'],
        profile_photo: 'https://via.placeholder.com/100x100',
        last_seen_at: '2025-01-01T15:30:00Z',
        verification_status: 'verified',
        verification_id_photo: null,
        verification_selfie: null,
        verified_at: '2025-01-01T10:00:00Z',
        verification_notes: null,
        country: 'USA',
        city: 'New York',
        age: 28,
        date_of_birth: '1996-05-15',
        is_active: true,
        is_suspended: false,
        suspension_reason: null,
        deleted_at: null,
        two_factor_confirmed_at: '2025-01-01T10:00:00Z',
        created_at: '2024-12-01T10:00:00Z',
        updated_at: '2025-01-01T15:30:00Z',
        role: 'user'
      },
      {
        id: 2,
        name: 'Maria Garcia',
        email: 'maria@example.com',
        email_verified_at: '2024-12-15T10:00:00Z',
        phone: '+1234567891',
        phone_verified_at: null,
        bio: 'Content writer',
        interests: ['writing', 'travel'],
        profile_photo: 'https://via.placeholder.com/100x100',
        last_seen_at: '2025-01-01T12:00:00Z',
        verification_status: 'pending',
        verification_id_photo: null,
        verification_selfie: null,
        verified_at: null,
        verification_notes: null,
        country: 'Spain',
        city: 'Madrid',
        age: 32,
        date_of_birth: '1992-08-22',
        is_active: true,
        is_suspended: false,
        suspension_reason: null,
        deleted_at: null,
        two_factor_confirmed_at: null,
        created_at: '2024-11-15T10:00:00Z',
        updated_at: '2025-01-01T12:00:00Z',
        role: 'writer'
      }
    ];
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onSortChange(): void {
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onViewUser(user: User): void {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  onSuspendUser(user: User): void {
    this.selectedUser = user;
    this.suspendForm.reset();
    this.showSuspendModal = true;
  }

  onDeleteUser(user: User): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  confirmSuspend(): void {
    if (this.selectedUser && this.suspendForm.valid) {
      this.isUpdating = true;
      const reason = this.suspendForm.get('reason')?.value;

      this.userService.suspendUser(this.selectedUser.id, reason).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User suspended successfully',
            life: 3000
          });
          this.showSuspendModal = false;
          this.loadUsers();
          this.isUpdating = false;
        },
        error: (error: any) => {
          console.error('Error suspending user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to suspend user',
            life: 3000
          });
          this.isUpdating = false;
        }
      });
    }
  }

  confirmUnsuspend(user: User): void {
    this.isUpdating = true;
    this.userService.unsuspendUser(user.id).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User unsuspended successfully',
          life: 3000
        });
        this.loadUsers();
        this.isUpdating = false;
      },
      error: (error: any) => {
        console.error('Error unsuspending user:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to unsuspend user',
          life: 3000
        });
        this.isUpdating = false;
      }
    });
  }

  confirmDelete(): void {
    if (this.selectedUser) {
      this.isUpdating = true;
      this.userService.deleteUser(this.selectedUser.id).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted successfully',
            life: 3000
          });
          this.showDeleteModal = false;
          this.loadUsers();
          this.isUpdating = false;
        },
        error: (error: any) => {
          console.error('Error deleting user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete user',
            life: 3000
          });
          this.isUpdating = false;
        }
      });
    }
  }

  updateVerificationStatus(user: User, status: 'verified' | 'rejected'): void {
    this.userService.updateVerificationStatus(user.id, status).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${status} successfully`,
          life: 3000
        });
        this.loadUsers();
      },
      error: (error: any) => {
        console.error('Error updating verification:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update verification status',
          life: 3000
        });
      }
    });
  }

  resetPassword(user: User): void {
    this.userService.resetUserPassword(user.id).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password reset successfully',
          life: 3000
        });
      },
      error: (error: any) => {
        console.error('Error resetting password:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to reset password',
          life: 3000
        });
      }
    });
  }

  closeModal(): void {
    this.showUserModal = false;
    this.showSuspendModal = false;
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  getStatusClass(user: User): string {
    if (user.is_suspended) return 'bg-danger';
    if (user.is_active) return 'bg-success';
    return 'bg-secondary';
  }

  getVerificationClass(status: string): string {
    switch (status) {
      case 'verified': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin': return 'bg-primary';
      case 'writer': return 'bg-info';
      case 'user': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Make Math available in template
  get Math() {
    return Math;
  }
}
