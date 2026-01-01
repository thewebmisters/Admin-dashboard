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
    verification_status: 'pending' | 'verified' | 'rejected';
    verification_id_photo: string | null;
    verification_selfie: string | null;
    verified_at: string | null;
    verification_notes: string | null;
    country: string;
    city: string;
    age: number;
    date_of_birth: string;
    is_active: boolean;
    is_suspended: boolean;
    suspension_reason: string | null;
    deleted_at: string | null;
    two_factor_confirmed_at: string | null;
    created_at: string;
    updated_at: string;
    role?: string;
}

export interface UserStats {
    total_users: number;
    active_users: number;
    suspended_users: number;
    verified_users: number;
    pending_verification: number;
    new_users_today: number;
    new_users_this_week: number;
    new_users_this_month: number;
}

export interface UserFilters {
    search?: string;
    status?: 'all' | 'active' | 'suspended';
    verification?: 'all' | 'verified' | 'pending' | 'rejected';
    role?: 'all' | 'user' | 'writer' | 'admin';
    sort_by?: 'name' | 'created_at' | 'last_seen_at';
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface UsersResponse {
    data: User[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}