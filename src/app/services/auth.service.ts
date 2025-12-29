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
                this.currentUserSubject.next(JSON.parse(user));
            }
        }
    }

    login(credentials: LoginRequest): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    if (response.token && isPlatformBrowser(this.platformId)) {
                        localStorage.setItem('auth_token', response.token);
                        localStorage.setItem('current_user', JSON.stringify(response.user));
                        this.currentUserSubject.next(response.user);
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
    handleApiError(err: any) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to load resource',
            life: 3000,
            sticky: false,
            closable: true
        });

    }
    handleSuccess(response: any) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message || 'success!', life: 300 })
    }
}