import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    Profile,
    PaginatedProfiles,
    CreateProfileRequest,
    UpdateProfileRequest,
    AssignWritersRequest,
    OnlineStatusRequest,
    GalleryPhoto
} from '../models/profile.model';
import { ApiResponse } from '../models/analytics.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private baseUrl = 'https://realspark.jonahdevs.co.ke/api'; // Update with your API base URL

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

    // Get all profiles (direct array response)
    getAllProfiles(
        perPage: number = 20,
        status?: 'active' | 'inactive',
        search?: string,
        page: number = 1
    ): Observable<Profile[]> {
        let params = new HttpParams()
            .set('per_page', perPage.toString())
            .set('page', page.toString());

        if (status) params = params.set('status', status);
        if (search) params = params.set('search', search);

        return this.http.get<Profile[]>(
            `${this.baseUrl}/profiles`,
            { headers: this.getHeaders(), params }
        );
    }

    // Get featured profiles (direct array response)
    getFeaturedProfiles(): Observable<Profile[]> {
        return this.http.get<Profile[]>(
            `${this.baseUrl}/profiles/featured`,
            { headers: this.getHeaders() }
        );
    }

    // Get single profile
    getProfile(id: number): Observable<ApiResponse<Profile>> {
        return this.http.get<ApiResponse<Profile>>(
            `${this.baseUrl}/profiles/${id}`,
            { headers: this.getHeaders() }
        );
    }

    // Get writer's profiles
    getWriterProfiles(writerId: number): Observable<ApiResponse<Profile[]>> {
        return this.http.get<ApiResponse<Profile[]>>(
            `${this.baseUrl}/profiles/writer/${writerId}`,
            { headers: this.getHeaders() }
        );
    }

    // Create profile (Admin only)
    createProfile(profileData: CreateProfileRequest): Observable<ApiResponse<Profile>> {
        return this.http.post<ApiResponse<Profile>>(
            `${this.baseUrl}/profiles`,
            profileData,
            { headers: this.getHeaders() }
        );
    }

    // Update profile (Admin only)
    updateProfile(id: number, profileData: UpdateProfileRequest): Observable<ApiResponse<Profile>> {
        return this.http.put<ApiResponse<Profile>>(
            `${this.baseUrl}/profiles/${id}`,
            profileData,
            { headers: this.getHeaders() }
        );
    }

    // Delete profile (Admin only)
    deleteProfile(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
            `${this.baseUrl}/profiles/${id}`,
            { headers: this.getHeaders() }
        );
    }

    // Assign writers to profile (Admin only)
    assignWriters(profileId: number, writerIds: AssignWritersRequest): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(
            `${this.baseUrl}/profiles/${profileId}/writers`,
            writerIds,
            { headers: this.getHeaders() }
        );
    }

    // Add gallery photo (Admin only)
    addGalleryPhoto(profileId: number, photo: File, caption?: string): Observable<ApiResponse<GalleryPhoto>> {
        const formData = new FormData();
        formData.append('photo', photo);
        if (caption) formData.append('caption', caption);

        let token = '';
        if (isPlatformBrowser(this.platformId)) {
            token = localStorage.getItem('auth_token') || '';
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<ApiResponse<GalleryPhoto>>(
            `${this.baseUrl}/profiles/${profileId}/gallery`,
            formData,
            { headers }
        );
    }

    // Remove gallery photo (Admin only)
    removeGalleryPhoto(profileId: number, galleryId: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
            `${this.baseUrl}/profiles/${profileId}/gallery/${galleryId}`,
            { headers: this.getHeaders() }
        );
    }

    // Update online status (Admin/Writer)
    updateOnlineStatus(profileId: number, status: OnlineStatusRequest): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(
            `${this.baseUrl}/profiles/${profileId}/online-status`,
            status,
            { headers: this.getHeaders() }
        );
    }
}