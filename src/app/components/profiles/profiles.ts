import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Profile, PaginatedProfiles } from '../../models/profile.model';

@Component({
    selector: 'app-profiles',
    imports: [CommonModule, FormsModule],
    templateUrl: './profiles.html',
    styleUrl: './profiles.css',
})
export class Profiles implements OnInit {
    profiles: Profile[] = [];
    featuredProfiles: Profile[] = [];
    isLoading = true;
    currentPage = 1;
    totalPages = 1;
    perPage = 20;
    searchTerm = '';
    statusFilter: 'active' | 'inactive' | '' = '';
    userRole: string | null = null;

    constructor(
        private profileService: ProfileService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.userRole = this.authService.getUserRole();
        this.loadProfiles();
        this.loadFeaturedProfiles();
    }

    loadProfiles(): void {
        this.isLoading = true;

        this.profileService.getAllProfiles(
            this.perPage,
            this.statusFilter || undefined,
            this.searchTerm || undefined,
            this.currentPage
        ).subscribe({
            next: (response) => {
                const data = response.data;
                this.profiles = data.data;
                this.currentPage = data.current_page;
                this.totalPages = Math.ceil(data.total / data.per_page);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading profiles:', error);
                this.isLoading = false;
            }
        });
    }

    loadFeaturedProfiles(): void {
        this.profileService.getFeaturedProfiles().subscribe({
            next: (response) => {
                this.featuredProfiles = response.data;
            },
            error: (error) => {
                console.error('Error loading featured profiles:', error);
            }
        });
    }

    onSearch(): void {
        this.currentPage = 1;
        this.loadProfiles();
    }

    onFilterChange(): void {
        this.currentPage = 1;
        this.loadProfiles();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadProfiles();
    }

    updateOnlineStatus(profileId: number, status: 'online' | 'away' | 'busy' | 'offline'): void {
        if (this.userRole === 'admin' || this.userRole === 'writer') {
            this.profileService.updateOnlineStatus(profileId, { online_status: status }).subscribe({
                next: (response) => {
                    console.log('Online status updated:', response);
                    this.loadProfiles(); // Refresh the list
                },
                error: (error) => {
                    console.error('Error updating online status:', error);
                }
            });
        }
    }

    deleteProfile(profileId: number): void {
        if (this.userRole === 'admin' && confirm('Are you sure you want to delete this profile?')) {
            this.profileService.deleteProfile(profileId).subscribe({
                next: (response) => {
                    console.log('Profile deleted:', response);
                    this.loadProfiles(); // Refresh the list
                },
                error: (error) => {
                    console.error('Error deleting profile:', error);
                }
            });
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'online': return 'text-green-500';
            case 'away': return 'text-yellow-500';
            case 'busy': return 'text-red-500';
            case 'offline': return 'text-gray-500';
            default: return 'text-gray-500';
        }
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'online': return 'pi-circle-fill';
            case 'away': return 'pi-clock';
            case 'busy': return 'pi-minus-circle';
            case 'offline': return 'pi-circle';
            default: return 'pi-circle';
        }
    }
}