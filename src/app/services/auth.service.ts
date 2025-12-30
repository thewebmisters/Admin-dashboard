import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    User: any;
    data: {
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: 'admin' | 'writer' | 'user';
        };
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'writer' | 'user';
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'https://realspark.jonahdevs.co.ke/api';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private messageService: MessageService) {
        // Check if user is already logged in (only in browser)
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('auth_token');
            const user = localStorage.getItem('current_user');
            if (token && user) {
                try {
                    this.currentUserSubject.next(JSON.parse(user));
                } catch (error) {
                    console.error('Error parsing stored user data:', error);
                    // Clear corrupted data
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('current_user');
                }
            }
        }
    }

    login(credentials: LoginRequest): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    if (response.token && isPlatformBrowser(this.platformId)) {
                        try {
                            localStorage.setItem('auth_token', response.token);
                            localStorage.setItem('current_user', JSON.stringify(response.user));
                            this.currentUserSubject.next(response.user);
                        } catch (error) {
                            console.error('Error storing user data:', error);
                            // Still update the subject even if localStorage fails
                            this.currentUserSubject.next(response.user);
                        }
                    }
                })
            );
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
        }
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return !!localStorage.getItem('auth_token');
        }
        return false;
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    getUserRole(): string | null {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    }

    isAdmin(): boolean {
        return this.getUserRole() === 'admin';
    }

    isWriter(): boolean {
        return this.getUserRole() === 'writer';
    }

    isUser(): boolean {
        return this.getUserRole() === 'user';
    }

    handleApiError(err: any): void {
        console.error('API Error:', err);

        let errorMessage = 'Failed to process your request';

        // Handle different error structures
        if (typeof err === 'string') {
            errorMessage = err;
        } else if (err?.error?.message) {
            errorMessage = err.error.message;
        } else if (err?.message) {
            errorMessage = err.message;
        } else if (err?.error) {
            errorMessage = typeof err.error === 'string' ? err.error : 'An error occurred';
        }

        // Only show toast if MessageService is available (browser environment)
        if (this.messageService && isPlatformBrowser(this.platformId)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 3000
            });
        } else {
            // Fallback for server-side rendering or when MessageService is not available
            console.error('Error (MessageService not available):', errorMessage);
        }
    }
    handleSuccess(response: any): void {
        let successMessage = 'Operation completed successfully';

        if (typeof response === 'string') {
            successMessage = response;
        } else if (response?.message) {
            successMessage = response.message;
        }

        // Only show toast if MessageService is available (browser environment)
        if (this.messageService && isPlatformBrowser(this.platformId)) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: successMessage,
                life: 3000
            });
        } else {
            console.log('Success (MessageService not available):', successMessage);
        }
    }
}