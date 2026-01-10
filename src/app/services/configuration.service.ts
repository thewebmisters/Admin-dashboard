import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    SystemConfiguration,
    ConfigurationRequest,
    ConfigurationResponse,
    SingleConfigResponse,
    ConfigurationStats
} from '../models/configuration.model';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
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

    // Get all system configurations
    getAllConfigurations(): Observable<{ message: string; data: SystemConfiguration[] }> {
        return this.http.get<{ message: string; data: SystemConfiguration[] }>(
            `${this.baseUrl}/system-configurations`,
            { headers: this.getHeaders() }
        );
    }

    // Get specific configuration by key
    getConfiguration(key: string): Observable<{ message: string; key: string; value: any }> {
        return this.http.get<{ message: string; key: string; value: any }>(
            `${this.baseUrl}/system-configurations/${key}`,
            { headers: this.getHeaders() }
        );
    }

    // Create or update configuration
    saveConfiguration(config: ConfigurationRequest): Observable<{ message: string; data: SystemConfiguration }> {
        return this.http.post<{ message: string; data: SystemConfiguration }>(
            `${this.baseUrl}/system-configurations`,
            config,
            { headers: this.getHeaders() }
        );
    }

    // Update existing configuration
    updateConfiguration(key: string, config: Partial<ConfigurationRequest>): Observable<{ message: string; data: SystemConfiguration }> {
        return this.http.put<{ message: string; data: SystemConfiguration }>(
            `${this.baseUrl}/system-configurations/${key}`,
            config,
            { headers: this.getHeaders() }
        );
    }

    // Delete configuration
    deleteConfiguration(key: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(
            `${this.baseUrl}/system-configurations/${key}`,
            { headers: this.getHeaders() }
        );
    }

    // Clear configuration cache
    clearCache(): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${this.baseUrl}/system-configurations/clear-cache`,
            {},
            { headers: this.getHeaders() }
        );
    }

    // Bulk update configurations
    bulkUpdateConfigurations(configs: ConfigurationRequest[]): Observable<ConfigurationResponse> {
        return this.http.post<ConfigurationResponse>(
            `${this.baseUrl}/system-configurations/bulk`,
            { configurations: configs },
            { headers: this.getHeaders() }
        );
    }

    // Get configuration statistics (custom endpoint suggestion)
    getConfigurationStats(): Observable<{ message: string; data: ConfigurationStats }> {
        return this.http.get<{ message: string; data: ConfigurationStats }>(
            `${this.baseUrl}/system-configurations/stats`,
            { headers: this.getHeaders() }
        );
    }

    // Export configurations (custom endpoint suggestion)
    exportConfigurations(): Observable<Blob> {
        return this.http.get(
            `${this.baseUrl}/system-configurations/export`,
            {
                headers: this.getHeaders(),
                responseType: 'blob'
            }
        );
    }

    // Import configurations (custom endpoint suggestion)
    importConfigurations(file: File): Observable<ConfigurationResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${isPlatformBrowser(this.platformId) ? localStorage.getItem('auth_token') || '' : ''}`
        });

        return this.http.post<ConfigurationResponse>(
            `${this.baseUrl}/system-configurations/import`,
            formData,
            { headers }
        );
    }

    // Validate configuration value (custom endpoint suggestion)
    validateConfiguration(key: string, value: string, type: string): Observable<{ valid: boolean; message?: string }> {
        return this.http.post<{ valid: boolean; message?: string }>(
            `${this.baseUrl}/system-configurations/validate`,
            { key, value, type },
            { headers: this.getHeaders() }
        );
    }
}