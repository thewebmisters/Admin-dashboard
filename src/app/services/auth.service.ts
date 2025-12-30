import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
    role: 'admin' | 'writer' | 'user';
    expires_at: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone: string;
    phone_verified_at: string | null;
    bio: string;
    interests: string[];
    profile_photo: string;
    last_seen_at: string | null;
    verification_status: string;
    verification_id_photo: string | null;
    verification_selfie: string | null;
    verified_at: string | null;
    verification_notes: string | null;
    country: string;
    city: string;
    age: number;
    date_of_birth: string;
    is_active: number;
    is_suspended: number;
    suspension_reason: string | null;
    deleted_at: string | null;
    two_factor_confirmed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    role: 'admin' | 'writer' | 'user' | null;
    isAuthenticated: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'https://realspark.jonahdevs.co.ke/api';
    private authStateSubject = new BehaviorSubject<AuthState>({
        user: null,
        token: null,
        role: null,
        isAuthenticated: false
    });

    public authState$ = this.authStateSubject.asObservable();
    public currentUser$ = this.authState$.pipe(
        map(state => state.user)
    );

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private messageService: MessageService) {
        // Initialize auth state from localStorage (only in browser)
        this.initializeAuthState();
    }

    private initializeAuthState(): void {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('auth_token');
            const user = localStorage.getItem('current_user');
            const role = localStorage.getItem('user_role');

            if (token && user && role) {
                try {
                    const parsedUser = JSON.parse(user);
                    this.authStateSubject.next({
                        user: parsedUser,
                        token: token,
                        role: role as 'admin' | 'writer' | 'user',
                        isAuthenticated: true
                    });
                } catch (error) {
                    console.error('Error parsing stored auth data:', error);
                    this.clearAuthData();
                }
            }
        }
    }

    private clearAuthData(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
            localStorage.removeItem('user_role');
        }
        this.authStateSubject.next({
            user: null,
            token: null,
            role: null,
            isAuthenticated: false
        });
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    if (response.token && isPlatformBrowser(this.platformId)) {
                        try {
                            // Store auth data
                            localStorage.setItem('auth_token', response.token);
                            localStorage.setItem('current_user', JSON.stringify(response.user));
                            localStorage.setItem('user_role', response.role);

                            // Update auth state
                            this.authStateSubject.next({
                                user: response.user,
                                token: response.token,
                                role: response.role,
                                isAuthenticated: true
                            });
                        } catch (error) {
                            console.error('Error storing auth data:', error);
                            // Still update the state even if localStorage fails
                            this.authStateSubject.next({
                                user: response.user,
                                token: response.token,
                                role: response.role,
                                isAuthenticated: true
                            });
                        }
                    }
                })
            );
    }

    logout(): void {
        this.clearAuthData();
    }

    isAuthenticated(): boolean {
        return this.authStateSubject.value.isAuthenticated;
    }

    getCurrentUser(): User | null {
        return this.authStateSubject.value.user;
    }

    getAuthState(): AuthState {
        return this.authStateSubject.value;
    }

    getToken(): string | null {
        return this.authStateSubject.value.token;
    }

    getUserRole(): string | null {
        return this.authStateSubject.value.role;
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