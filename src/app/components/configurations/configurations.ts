import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfigurationService } from '../../services/configuration.service';
import { AuthService } from '../../services/auth.service';
import { Layout } from '../shared/layout/layout';
import {
    SystemConfiguration,
    ConfigurationRequest,
    ConfigurationStats,
    CONFIG_CATEGORIES,
    COMMON_CONFIGS
} from '../../models/configuration.model';

@Component({
    selector: 'app-configurations',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, Layout],
    templateUrl: './configurations.html',
    styleUrl: './configurations.css',
})
export class Configurations implements OnInit {
    configurations: SystemConfiguration[] = [];
    filteredConfigurations: SystemConfiguration[] = [];
    configStats: ConfigurationStats | null = null;
    isLoading = true;
    isUpdating = false;
    isSaving = false;

    // UI State
    activeTab = 'all';
    searchTerm = '';
    selectedCategory = 'all';
    showAddModal = false;
    showEditModal = false;
    showDeleteModal = false;
    showImportModal = false;
    selectedConfig: SystemConfiguration | null = null;

    // Forms
    addConfigForm: FormGroup;
    editConfigForm: FormGroup;
    importFile: File | null = null;

    // Categories
    categories = CONFIG_CATEGORIES;
    commonConfigs = COMMON_CONFIGS;

    // Make Object available in template
    get Object() {
        return Object;
    }

    // Get category values for template
    getCategoryValues(): string[] {
        return Object.values(this.categories);
    }

    constructor(
        private configService: ConfigurationService,
        private authService: AuthService,
        private messageService: MessageService,
        private formBuilder: FormBuilder
    ) {
        this.addConfigForm = this.formBuilder.group({
            key: ['', [Validators.required, Validators.maxLength(255)]],
            value: ['', [Validators.required]],
            type: ['string', [Validators.required]],
            description: ['', [Validators.maxLength(500)]]
        });

        this.editConfigForm = this.formBuilder.group({
            key: ['', [Validators.required, Validators.maxLength(255)]],
            value: ['', [Validators.required]],
            type: ['string', [Validators.required]],
            description: ['', [Validators.maxLength(500)]]
        });
    }

    ngOnInit(): void {
        this.loadConfigurations();
        //this.loadConfigStats();
    }

    loadConfigurations(): void {
        this.isLoading = true;
        this.configService.getAllConfigurations().subscribe({
            next: (response) => {
                // Handle the exact API response structure you provided
                this.configurations = response.data || [];
                this.applyFilters();
                this.isLoading = false;
            },
            error: (error: any) => {
                console.error('Error loading configurations:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load configurations',
                    life: 3000
                });
                this.isLoading = false;
                // Load fallback data for demo
                this.loadFallbackData();
            }
        });
    }

    loadConfigStats(): void {
        this.configService.getConfigurationStats().subscribe({
            next: (response: any) => {
                this.configStats = response.data;
            },
            error: (error: any) => {
                console.error('Error loading config stats:', error);
                // Create fallback stats
                this.configStats = {
                    total_configurations: this.configurations.length,
                    last_updated: new Date().toISOString(),
                    cache_status: 'active',
                    categories: {
                        'Chat Settings': 3,
                        'Payment & Tokens': 2,
                        'System Settings': 2,
                        'Security': 1
                    }
                };
            }
        });
    }

    private loadFallbackData(): void {
        this.configurations = [
            {
                id: 1,
                key: 'chat_claim_timeout_minutes',
                value: '5',
                type: 'integer',
                description: 'Minutes before unclaimed chat is released',
                created_at: '2025-01-01T10:00:00Z',
                updated_at: '2025-01-01T10:00:00Z'
            },
            {
                id: 2,
                key: 'message_cost_tokens',
                value: '1',
                type: 'integer',
                description: 'Base tokens required per message',
                created_at: '2025-01-01T10:00:00Z',
                updated_at: '2025-01-01T10:00:00Z'
            },
            {
                id: 3,
                key: 'revenue_share_percentage',
                value: '70',
                type: 'integer',
                description: 'Percentage women keep from message earnings',
                created_at: '2025-01-01T10:00:00Z',
                updated_at: '2025-01-01T10:00:00Z'
            },
            {
                id: 4,
                key: 'maintenance_mode',
                value: 'false',
                type: 'boolean',
                description: 'Enable maintenance mode',
                created_at: '2025-01-01T10:00:00Z',
                updated_at: '2025-01-01T10:00:00Z'
            }
        ];
        this.applyFilters();
    }

    onSearch(): void {
        this.applyFilters();
    }

    onCategoryChange(): void {
        this.applyFilters();
    }

    private applyFilters(): void {
        let filtered = [...this.configurations];

        // Apply search filter
        if (this.searchTerm.trim()) {
            filtered = filtered.filter(config =>
                config.key.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                config.description.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (this.selectedCategory !== 'all') {
            const categoryConfigs = this.commonConfigs
                .filter(c => c.category === this.selectedCategory)
                .map(c => c.key);
            filtered = filtered.filter(config => categoryConfigs.includes(config.key));
        }

        this.filteredConfigurations = filtered;
    }

    onAddConfig(): void {
        this.addConfigForm.reset();
        this.addConfigForm.patchValue({ type: 'string' });
        this.showAddModal = true;
    }

    onEditConfig(config: SystemConfiguration): void {
        this.selectedConfig = config;
        this.editConfigForm.patchValue({
            key: config.key,
            value: config.value,
            type: config.type,
            description: config.description
        });
        this.showEditModal = true;
    }

    onDeleteConfig(config: SystemConfiguration): void {
        this.selectedConfig = config;
        this.showDeleteModal = true;
    }

    confirmAddConfig(): void {
        if (this.addConfigForm.valid) {
            this.isSaving = true;
            const configData: ConfigurationRequest = this.addConfigForm.value;

            this.configService.saveConfiguration(configData).subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: response.message || 'Configuration added successfully',
                        life: 3000
                    });
                    this.showAddModal = false;
                    this.loadConfigurations();
                    this.isSaving = false;
                },
                error: (error: any) => {
                    console.error('Error adding configuration:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to add configuration',
                        life: 3000
                    });
                    this.isSaving = false;
                }
            });
        }
    }

    confirmEditConfig(): void {
        if (this.editConfigForm.valid && this.selectedConfig) {
            this.isUpdating = true;
            const configData: Partial<ConfigurationRequest> = {
                value: this.editConfigForm.get('value')?.value,
                type: this.editConfigForm.get('type')?.value,
                description: this.editConfigForm.get('description')?.value
            };

            this.configService.updateConfiguration(this.selectedConfig.key, configData).subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: response.message || 'Configuration updated successfully',
                        life: 3000
                    });
                    this.showEditModal = false;
                    this.loadConfigurations();
                    this.isUpdating = false;
                },
                error: (error: any) => {
                    console.error('Error updating configuration:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to update configuration',
                        life: 3000
                    });
                    this.isUpdating = false;
                }
            });
        }
    }

    confirmDeleteConfig(): void {
        if (this.selectedConfig) {
            this.isUpdating = true;
            this.configService.deleteConfiguration(this.selectedConfig.key).subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: response.message || 'Configuration deleted successfully',
                        life: 3000
                    });
                    this.showDeleteModal = false;
                    this.loadConfigurations();
                    this.isUpdating = false;
                },
                error: (error: any) => {
                    console.error('Error deleting configuration:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to delete configuration',
                        life: 3000
                    });
                    this.isUpdating = false;
                }
            });
        }
    }

    clearCache(): void {
        this.configService.clearCache().subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Configuration cache cleared successfully',
                    life: 3000
                });
                this.loadConfigStats();
            },
            error: (error: any) => {
                console.error('Error clearing cache:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to clear cache',
                    life: 3000
                });
            }
        });
    }

    exportConfigurations(): void {
        this.configService.exportConfigurations().subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `system-configurations-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                window.URL.revokeObjectURL(url);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Configurations exported successfully',
                    life: 3000
                });
            },
            error: (error: any) => {
                console.error('Error exporting configurations:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to export configurations',
                    life: 3000
                });
            }
        });
    }

    onImportFile(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.importFile = file;
        }
    }

    importConfigurations(): void {
        if (this.importFile) {
            this.configService.importConfigurations(this.importFile).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Configurations imported successfully',
                        life: 3000
                    });
                    this.showImportModal = false;
                    this.importFile = null;
                    this.loadConfigurations();
                },
                error: (error: any) => {
                    console.error('Error importing configurations:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to import configurations',
                        life: 3000
                    });
                }
            });
        }
    }

    closeModal(): void {
        this.showAddModal = false;
        this.showEditModal = false;
        this.showDeleteModal = false;
        this.showImportModal = false;
        this.selectedConfig = null;
        this.importFile = null;
    }

    getTypeClass(type: string): string {
        switch (type) {
            case 'boolean': return 'bg-success';
            case 'integer': return 'bg-primary';
            case 'decimal': return 'bg-info';
            case 'json': return 'bg-warning';
            default: return 'bg-secondary';
        }
    }

    getConfigCategory(key: string): string {
        const config = this.commonConfigs.find(c => c.key === key);
        return config?.category || 'System Settings';
    }

    formatValue(value: string, type: string): string {
        switch (type) {
            case 'boolean':
                return value === 'true' ? 'Enabled' : 'Disabled';
            case 'json':
                try {
                    return JSON.stringify(JSON.parse(value), null, 2);
                } catch {
                    return value;
                }
            default:
                return value;
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    getFormattedLastUpdated(): string {
        return this.configStats?.last_updated ? this.formatDate(this.configStats.last_updated) : 'Today';
    }

    getCategoryIcon(category: string): string {
        switch (category) {
            case CONFIG_CATEGORIES.CHAT: return 'pi-comments';
            case CONFIG_CATEGORIES.PAYMENT: return 'pi-dollar';
            case CONFIG_CATEGORIES.SYSTEM: return 'pi-cog';
            case CONFIG_CATEGORIES.SECURITY: return 'pi-shield';
            case CONFIG_CATEGORIES.NOTIFICATIONS: return 'pi-bell';
            case CONFIG_CATEGORIES.MAINTENANCE: return 'pi-wrench';
            default: return 'pi-cog';
        }
    }
}