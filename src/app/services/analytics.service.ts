import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, UserAnalytics, WriterAnalytics, AdminAnalytics, AdminAnalyticsResponse, ChartData } from '../models/analytics.model';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
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

    // User Analytics
    getUserAnalytics(): Observable<ApiResponse<UserAnalytics>> {
        return this.http.get<ApiResponse<UserAnalytics>>(
            `${this.baseUrl}/analytics/user`,
            { headers: this.getHeaders() }
        );
    }

    getUserSpendingChart(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Observable<ApiResponse<ChartData>> {
        const params = new HttpParams().set('period', period);
        return this.http.get<ApiResponse<ChartData>>(
            `${this.baseUrl}/analytics/user/spending-chart`,
            { headers: this.getHeaders(), params }
        );
    }

    // Writer Analytics
    getWriterAnalytics(): Observable<ApiResponse<WriterAnalytics>> {
        return this.http.get<ApiResponse<WriterAnalytics>>(
            `${this.baseUrl}/analytics/writer`,
            { headers: this.getHeaders() }
        );
    }

    getWriterEarningsChart(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Observable<ApiResponse<ChartData>> {
        const params = new HttpParams().set('period', period);
        return this.http.get<ApiResponse<ChartData>>(
            `${this.baseUrl}/analytics/writer/earnings-chart`,
            { headers: this.getHeaders(), params }
        );
    }

    // Admin Analytics - Updated to match actual API response
    getAdminAnalytics(): Observable<AdminAnalyticsResponse> {
        return this.http.get<AdminAnalyticsResponse>(
            `${this.baseUrl}/analytics/admin`,
            { headers: this.getHeaders() }
        );
    }
}