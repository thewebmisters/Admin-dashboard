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
            next: (profiles) => {
                this.profiles = profiles;
                // Since API doesn't return pagination info, we'll handle it client-side for now
                this.totalPages = Math.ceil(profiles.length / this.perPage);
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
            next: (profiles) => {
                this.featuredProfiles = profiles;
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
            // For now, just update locally since the API structure might be different
            const profile = this.profiles.find(p => p.id === profileId);
            if (profile) {
                profile.is_online = status === 'online';
                console.log('Online status updated locally:', profile);
            }

            // Uncomment when API is ready
            /*
            this.profileService.updateOnlineStatus(profileId, { online_status: status }).subscribe({
                next: (response) => {
                    console.log('Online status updated:', response);
                    this.loadProfiles(); // Refresh the list
                },
                error: (error) => {
                    console.error('Error updating online status:', error);
                }
            });
            */
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

    // Helper methods for template
    getActiveProfilesCount(): number {
        return this.profiles.filter(p => p.is_active).length;
    }

    getOnlineProfilesCount(): number {
        return this.profiles.filter(p => p.is_online).length;
    }

    getFilteredProfiles(): Profile[] {
        let filtered = [...this.profiles];

        // Apply search filter
        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(profile =>
                profile.name.toLowerCase().includes(searchLower) ||
                profile.country.toLowerCase().includes(searchLower) ||
                profile.city.toLowerCase().includes(searchLower) ||
                profile.interests.some(interest =>
                    interest.toLowerCase().includes(searchLower)
                )
            );
        }

        // Apply status filter
        if (this.statusFilter === 'active') {
            filtered = filtered.filter(profile => profile.is_active);
        } else if (this.statusFilter === 'inactive') {
            filtered = filtered.filter(profile => !profile.is_active);
        }

        return filtered;
    }

    getOnlineStatusClass(isOnline: boolean): string {
        return isOnline ? 'bg-success' : 'bg-secondary';
    }

    // Action methods
    viewProfile(profile: Profile): void {
        console.log('View profile:', profile);
        // Navigate to profile details or open modal
    }

    editProfile(profile: Profile): void {
        console.log('Edit profile:', profile);
        // Open edit modal or navigate to edit page
    }

    toggleFeatured(profile: Profile): void {
        console.log('Toggle featured:', profile);
        // Call API to toggle featured status
        profile.is_featured = !profile.is_featured;
    }

    toggleActive(profile: Profile): void {
        console.log('Toggle active:', profile);
        // Call API to toggle active status
        profile.is_active = !profile.is_active;
    }
}