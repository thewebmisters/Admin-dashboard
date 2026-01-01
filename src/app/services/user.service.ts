import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserStats, UserFilters, UsersResponse } from '../models/user.model';

interface ApiResponse<T> {
    message: string;
    data: T;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'https://realspark.jonahdevs.co.ke/api';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

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

    // Get all users with filters and pagination
    getUsers(filters?: UserFilters): Observable<ApiResponse<UsersResponse>> {
        let params = new HttpParams();

        if (filters) {
            if (filters.search) params = params.set('search', filters.search);
            if (filters.status && filters.status !== 'all') params = params.set('status', filters.status);
            if (filters.verification && filters.verification !== 'all') params = params.set('verification', filters.verification);
            if (filters.role && filters.role !== 'all') params = params.set('role', filters.role);
            if (filters.sort_by) params = params.set('sort_by', filters.sort_by);
            if (filters.sort_order) params = params.set('sort_order', filters.sort_order);
            if (filters.page) params = params.set('page', filters.page.toString());
            if (filters.per_page) params = params.set('per_page', filters.per_page.toString());
        }

        return this.http.get<ApiResponse<UsersResponse>>(
            `${this.baseUrl}/admin/users`,
            { headers: this.getHeaders(), params }
        );
    }

    // Get user statistics
    getUserStats(): Observable<ApiResponse<UserStats>> {
        return this.http.get<ApiResponse<UserStats>>(
            `${this.baseUrl}/admin/users/stats`,
            { headers: this.getHeaders() }
        );
    }

    // Get single user details
    getUser(userId: number): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(
            `${this.baseUrl}/admin/users/${userId}`,
            { headers: this.getHeaders() }
        );
    }

    // Suspend user
    suspendUser(userId: number, reason: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(
            `${this.baseUrl}/admin/users/${userId}/suspend`,
            { reason },
            { headers: this.getHeaders() }
        );
    }

    // Unsuspend user
    unsuspendUser(userId: number): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(
            `${this.baseUrl}/admin/users/${userId}/unsuspend`,
            {},
            { headers: this.getHeaders() }
        );
    }

    // Delete user
    deleteUser(userId: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
            `${this.baseUrl}/admin/users/${userId}`,
            { headers: this.getHeaders() }
        );
    }

    // Update user verification status
    updateVerificationStatus(userId: number, status: 'verified' | 'rejected', notes?: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(
            `${this.baseUrl}/admin/users/${userId}/verification`,
            { status, notes },
            { headers: this.getHeaders() }
        );
    }

    // Reset user password
    resetUserPassword(userId: number): Observable<ApiResponse<{ temporary_password: string }>> {
        return this.http.post<ApiResponse<{ temporary_password: string }>>(
            `${this.baseUrl}/admin/users/${userId}/reset-password`,
            {},
            { headers: this.getHeaders() }
        );
    }

    // Send user notification
    sendNotification(userId: number, title: string, message: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(
            `${this.baseUrl}/admin/users/${userId}/notify`,
            { title, message },
            { headers: this.getHeaders() }
        );
    }
}