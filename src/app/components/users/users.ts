
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  role: 'Client' | 'Writer';
  status: 'Active' | 'Suspended';
  joinDate: string;
}
@Component({
  selector: 'app-users',
  imports: [FormsModule, CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Client',
      status: 'Active',
      joinDate: '2025-10-15'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      role: 'Writer',
      status: 'Active',
      joinDate: '2025-09-20'
    },
    {
      id: 3,
      name: 'Suspended User',
      role: 'Client',
      status: 'Suspended',
      joinDate: '2025-08-01'
    }
  ];

  filteredUsers: User[] = [];
  searchTerm = '';
  selectedFilter = 'All Users';

  constructor() { }

  ngOnInit(): void {
    this.filteredUsers = [...this.users];
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply role/status filter
    switch (this.selectedFilter) {
      case 'Clients':
        filtered = filtered.filter(user => user.role === 'Client');
        break;
      case 'Writers':
        filtered = filtered.filter(user => user.role === 'Writer');
        break;
      case 'Suspended':
        filtered = filtered.filter(user => user.status === 'Suspended');
        break;
    }

    this.filteredUsers = filtered;
  }

  onViewUser(user: User): void {
    console.log('View user:', user);
    // Handle view user logic
  }

  onToggleUserStatus(user: User): void {
    const action = user.status === 'Active' ? 'suspend' : 'unsuspend';
    console.log(`${action} user:`, user);

    // Update user status
    user.status = user.status === 'Active' ? 'Suspended' : 'Active';
    this.applyFilters();
  }

  onNavigate(route: string): void {
    console.log('Navigate to:', route);
  }

  onLogout(): void {
    console.log('Logout clicked');
  }

  getRoleClass(role: string): string {
    return role === 'Client'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  }

  getStatusClass(status: string): string {
    return status === 'Active'
      ? 'text-green-600'
      : 'text-red-600';
  }

  getActionButtonText(status: string): string {
    return status === 'Active' ? 'Suspend' : 'Un-suspend';
  }

  getActionButtonClass(status: string): string {
    return status === 'Active'
      ? 'text-red-600'
      : 'text-green-600';
  }

}
