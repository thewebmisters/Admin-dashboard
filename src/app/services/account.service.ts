import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiResponse<T> {
    message: string;
    data: T;
}

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

interface UpdateAccountRequest {
    name?: string;
    bio?: string;
    interests?: string[];
    age?: number;
    date_of_birth?: string;
    country?: string;
    city?: string;
    phone?: string;
}

interface UpdatePasswordRequest {
    current_password: string;
    password: string;
    password_confirmation: string;
}

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private baseUrl = 'https://realspark.jonahdevs.co.ke/api';

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

    private getHeaders(): HttpHeaders {
        let token = '';
        if (isPlatformBrowser(this.platformId)) {
            token = localStorage.getItem('auth_token') || '';
        }
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    private getMultipartHeaders(): HttpHeaders {
        let token = '';
        if (isPlatformBrowser(this.platformId)) {
            token = localStorage.getItem('auth_token') || '';
        }
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    // Get account details
    getAccountDetails(): Observable<ApiResponse<AccountDetails>> {
        return this.http.get<ApiResponse<AccountDetails>>(
            `${this.baseUrl}/account`,
            { headers: this.getHeaders() }
        );
    }

    // Update account details
    updateAccount(data: UpdateAccountRequest): Observable<ApiResponse<AccountDetails>> {
        return this.http.put<ApiResponse<AccountDetails>>(
            `${this.baseUrl}/account`,
            data,
            { headers: this.getHeaders() }
        );
    }

    // Update profile photo
    updateProfilePhoto(photo: File): Observable<ApiResponse<{ profile_photo: string }>> {
        const formData = new FormData();
        formData.append('photo', photo);

        return this.http.post<ApiResponse<{ profile_photo: string }>>(
            `${this.baseUrl}/account/profile-photo`,
            formData,
            { headers: this.getMultipartHeaders() }
        );
    }

    // Delete profile photo
    deleteProfilePhoto(): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
            `${this.baseUrl}/account/profile-photo`,
            { headers: this.getHeaders() }
        );
    }

    // Update password
    updatePassword(data: UpdatePasswordRequest): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(
            `${this.baseUrl}/account/password`,
            data,
            { headers: this.getHeaders() }
        );
    }

    // Delete account
    deleteAccount(password: string): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
            `${this.baseUrl}/account`,
            {
                headers: this.getHeaders(),
                body: { password }
            }
        );
    }

    // Get gallery
    getGallery(): Observable<ApiResponse<GalleryPhoto[]>> {
        return this.http.get<ApiResponse<GalleryPhoto[]>>(
            `${this.baseUrl}/account/gallery`,
            { headers: this.getHeaders() }
        );
    }

    // Add gallery photo
    addGalleryPhoto(photo: File, caption?: string): Observable<ApiResponse<GalleryPhoto>> {
        const formData = new FormData();
        formData.append('photo', photo);
        if (caption) {
            formData.append('caption', caption);
        }

        return this.http.post<ApiResponse<GalleryPhoto>>(
            `${this.baseUrl}/account/gallery`,
            formData,
            { headers: this.getMultipartHeaders() }
        );
    }

    // Update gallery photo
    updateGalleryPhoto(photoId: number, caption?: string, sortOrder?: number): Observable<ApiResponse<GalleryPhoto>> {
        const data: any = {};
        if (caption !== undefined) data.caption = caption;
        if (sortOrder !== undefined) data.sort_order = sortOrder;

        return this.http.put<ApiResponse<GalleryPhoto>>(
            `${this.baseUrl}/account/gallery/${photoId}`,
            data,
            { headers: this.getHeaders() }
        );
    }

    // Delete gallery photo
    deleteGalleryPhoto(photoId: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
            `${this.baseUrl}/account/gallery/${photoId}`,
            { headers: this.getHeaders() }
        );
    }
}