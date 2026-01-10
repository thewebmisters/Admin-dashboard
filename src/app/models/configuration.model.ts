export interface SystemConfiguration {
    id: number;
    key: string;
    value: string;
    type: 'string' | 'integer' | 'decimal' | 'boolean' | 'json';
    description: string;
    created_at: string;
    updated_at: string;
}

export interface ConfigurationRequest {
    key: string;
    value: string;
    type: 'string' | 'integer' | 'decimal' | 'boolean' | 'json';
    description?: string;
}

export interface ConfigurationResponse {
    message: string;
    data: SystemConfiguration | SystemConfiguration[];
}

export interface SingleConfigResponse {
    message: string;
    key: string;
    value: any; // Auto-cast to correct type
}

export interface ConfigurationStats {
    total_configurations: number;
    last_updated: string;
    cache_status: 'active' | 'cleared';
    categories: {
        [key: string]: number;
    };
}

// Predefined configuration categories for better organization
export const CONFIG_CATEGORIES = {
    CHAT: 'Chat Settings',
    PAYMENT: 'Payment & Tokens',
    SYSTEM: 'System Settings',
    SECURITY: 'Security',
    NOTIFICATIONS: 'Notifications',
    MAINTENANCE: 'Maintenance'
} as const;

// Common configuration keys with their categories
export const COMMON_CONFIGS = [
    {
        key: 'chat_claim_timeout_minutes',
        category: CONFIG_CATEGORIES.CHAT,
        type: 'integer' as const,
        description: 'Minutes before unclaimed chat is released',
        defaultValue: '5'
    },
    {
        key: 'message_cost_tokens',
        category: CONFIG_CATEGORIES.PAYMENT,
        type: 'integer' as const,
        description: 'Base tokens required per message',
        defaultValue: '1'
    },
    {
        key: 'revenue_share_percentage',
        category: CONFIG_CATEGORIES.PAYMENT,
        type: 'integer' as const,
        description: 'Percentage women keep from message earnings',
        defaultValue: '70'
    },
    {
        key: 'maintenance_mode',
        category: CONFIG_CATEGORIES.MAINTENANCE,
        type: 'boolean' as const,
        description: 'Enable maintenance mode',
        defaultValue: 'false'
    },
    {
        key: 'max_daily_messages',
        category: CONFIG_CATEGORIES.CHAT,
        type: 'integer' as const,
        description: 'Maximum messages per user per day',
        defaultValue: '100'
    },
    {
        key: 'minimum_payout_amount',
        category: CONFIG_CATEGORIES.PAYMENT,
        type: 'decimal' as const,
        description: 'Minimum amount for payout requests',
        defaultValue: '50.00'
    },
    {
        key: 'session_timeout_minutes',
        category: CONFIG_CATEGORIES.SECURITY,
        type: 'integer' as const,
        description: 'User session timeout in minutes',
        defaultValue: '60'
    },
    {
        key: 'email_notifications_enabled',
        category: CONFIG_CATEGORIES.NOTIFICATIONS,
        type: 'boolean' as const,
        description: 'Enable email notifications',
        defaultValue: 'true'
    }
];