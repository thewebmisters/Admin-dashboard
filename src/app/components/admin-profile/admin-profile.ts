import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';

interface AccountDetails {
    id: number;
    name: string;
    email: string;
    phone: string;
    phone_verified_at: string | null;
    bio: string;
    interests: string[];
    profile_photo: string;
    age: number;
    date_of_birth: string;
    country: string;
    city: string;
    verification_status: string;
    verified_at: string | null;
    is_active: boolean;
    is_suspended: boolean;
    last_seen_at: string | null;
    created_at: string;
    updated_at: string;
}

interface GalleryPhoto {
    id: number;
    user_id: number;
    photo_path: string;
    caption: string;
    sort_order: number;
    created_at: string;
}

@Component({
    selector: 'app-admin-profile',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './admin-profile.html',
    styleUrl: './admin-profile.css',
})
export class AdminProfile implements OnInit {
    accountDetails: AccountDetails | null = null;
    galleryPhotos: GalleryPhoto[] = [];
    isLoading = true;
    isUpdating = false;
    activeTab = 'profile';

    // Forms
    profileForm: FormGroup;
    passwordForm: FormGroup;

    // File upload
    selectedProfilePhoto: File | null = null;
    selectedGalleryPhoto: File | null = null;
    galleryCaption = '';

    constructor(
        private authService: AuthService,
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private messageService: MessageService
    ) {
        this.profileForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(255)]],
            bio: ['', [Validators.maxLength(1000)]],
            interests: [''],
            age: ['', [Validators.min(18), Validators.max(100)]],
            date_of_birth: [''],
            country: ['', [Validators.maxLength(100)]],
            city: ['', [Validators.maxLength(100)]],
            phone: ['']
        });

        this.passwordForm = this.formBuilder.group({
            current_password: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            password_confirmation: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.loadAccountDetails();
        this.loadGallery();
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('password_confirmation');
        return password && confirmPassword && password.value === confirmPassword.value
            ? null : { passwordMismatch: true };
    }

    loadAccountDetails(): void {
        this.isLoading = true;
        this.accountService.getAccountDetails().subscribe({
            next: (response: any) => {
                this.accountDetails = response.data;
                this.populateProfileForm();
                this.isLoading = false;
            },
            error: (error: any) => {
                console.error('Error loading account details:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load account details',
                    life: 3000
                });
                this.isLoading = false;
            }
        });
    }

    loadGallery(): void {
        this.accountService.getGallery().subscribe({
            next: (response: any) => {
                this.galleryPhotos = response.data;
            },
            error: (error: any) => {
                console.error('Error loading gallery:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load gallery photos',
                    life: 3000
                });
            }
        });
    }

    populateProfileForm(): void {
        if (this.accountDetails) {
            this.profileForm.patchValue({
                name: this.accountDetails.name,
                bio: this.accountDetails.bio,
                interests: this.accountDetails.interests.join(', '),
                age: this.accountDetails.age,
                date_of_birth: this.accountDetails.date_of_birth,
                country: this.accountDetails.country,
                city: this.accountDetails.city,
                phone: this.accountDetails.phone
            });
        }
    }

    onProfilePhotoSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedProfilePhoto = file;
        }
    }

    onGalleryPhotoSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedGalleryPhoto = file;
        }
    }

    updateProfile(): void {
        if (this.profileForm.valid) {
            this.isUpdating = true;
            const formData = { ...this.profileForm.value };

            // Convert interests string to array
            if (formData.interests) {
                formData.interests = formData.interests.split(',').map((i: string) => i.trim());
            }

            this.accountService.updateAccount(formData).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Profile updated successfully',
                        life: 3000
                    });
                    this.loadAccountDetails(); // Refresh data
                    this.isUpdating = false;
                },
                error: (error: any) => {
                    console.error('Error updating profile:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to update profile',
                        life: 3000
                    });
                    this.isUpdating = false;
                }
            });
        }
    }

    updateProfilePhoto(): void {
        if (this.selectedProfilePhoto) {
            this.isUpdating = true;
            this.accountService.updateProfilePhoto(this.selectedProfilePhoto).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Profile photo updated successfully',
                        life: 3000
                    });
                    this.loadAccountDetails(); // Refresh data
                    this.selectedProfilePhoto = null;
                    this.isUpdating = false;
                },
                error: (error: any) => {
                    console.error('Error updating profile photo:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to update profile photo',
                        life: 3000
                    });
                    this.isUpdating = false;
                }
            });
        }
    }

    deleteProfilePhoto(): void {
        if (confirm('Are you sure you want to delete your profile photo?')) {
            this.accountService.deleteProfilePhoto().subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Profile photo deleted successfully',
                        life: 3000
                    });
                    this.loadAccountDetails(); // Refresh data
                },
                error: (error: any) => {
                    console.error('Error deleting profile photo:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to delete profile photo',
                        life: 3000
                    });
                }
            });
        }
    }

    updatePassword(): void {
        if (this.passwordForm.valid) {
            this.isUpdating = true;
            this.accountService.updatePassword(this.passwordForm.value).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Password updated successfully',
                        life: 3000
                    });
                    this.passwordForm.reset();
                    this.isUpdating = false;
                },
                error: (error: any) => {
                    console.error('Error updating password:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to update password',
                        life: 3000
                    });
                    this.isUpdating = false;
                }
            });
        }
    }

    addGalleryPhoto(): void {
        if (this.selectedGalleryPhoto) {
            this.accountService.addGalleryPhoto(this.selectedGalleryPhoto, this.galleryCaption).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Photo added to gallery successfully',
                        life: 3000
                    });
                    this.loadGallery(); // Refresh gallery
                    this.selectedGalleryPhoto = null;
                    this.galleryCaption = '';
                },
                error: (error: any) => {
                    console.error('Error adding gallery photo:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to add photo to gallery',
                        life: 3000
                    });
                }
            });
        }
    }

    deleteGalleryPhoto(photoId: number): void {
        if (confirm('Are you sure you want to delete this photo?')) {
            this.accountService.deleteGalleryPhoto(photoId).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Photo deleted successfully',
                        life: 3000
                    });
                    this.loadGallery(); // Refresh gallery
                },
                error: (error: any) => {
                    console.error('Error deleting gallery photo:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to delete photo',
                        life: 3000
                    });
                }
            });
        }
    }

    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }

    getVerificationStatusClass(status: string): string {
        switch (status) {
            case 'verified': return 'bg-success';
            case 'pending': return 'bg-warning';
            case 'rejected': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }
}