export interface UserAnalytics {
    total_spending: string;
    total_tokens_purchased: number;
    total_tokens_spent: number;
    current_balance: number;
    messages_sent: number;
    active_chats: number;
    favorite_profiles: number;
    account_created_days_ago: number;
    last_purchase: {
        date: string;
        amount: string;
        tokens: number;
    };
}

export interface WriterAnalytics {
    total_earnings: string;
    total_tokens_earned: number;
    messages_sent: number;
    active_chats: number;
    claimed_chats: number;
    available_chats: number;
    assigned_profiles: number;
    average_response_time_minutes: number;
    earnings_this_month: string;
    messages_this_month: number;
}

export interface AdminAnalytics {
    total_users: number;
    active_users: number;
    total_profiles: number;
    active_profiles: number;
    total_writers: number;
    active_writers: number;
    total_revenue: string;
    revenue_this_month: string;
    total_chats: number;
    active_chats: number;
    total_messages: number;
    messages_today: number;
    pending_reports: number;
    pending_verifications: number;
    token_circulation: number;
    average_tokens_per_user: number;
}

export interface ChartData {
    labels: string[];
    spending?: number[];
    tokens_used?: number[];
    earnings?: number[];
    messages?: number[];
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}