export interface Profile {
    id: number;
    name: string;
    age: number;
    bio: string;
    interests: string[];
    profile_photo: string;
    gallery: GalleryPhoto[];
    country: string;
    city: string;
    is_online: boolean;
    last_seen_at: string | null;
    is_active: boolean;
    is_featured: boolean;
    total_chats: number;
    response_rate: number;
    average_response_time: number | null;
    total_earnings: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface GalleryPhoto {
    id: number;
    profile_id: number;
    image_path: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface PaginatedProfiles {
    current_page: number;
    data: Profile[];
    per_page: number;
    total: number;
}

export interface CreateProfileRequest {
    name: string;
    age: number;
    bio: string;
    interests: string[];
    country: string;
    city: string;
}

export interface UpdateProfileRequest {
    name?: string;
    age?: number;
    bio?: string;
    interests?: string[];
    country?: string;
    city?: string;
}

export interface AssignWritersRequest {
    writer_ids: number[];
}

export interface OnlineStatusRequest {
    online_status: 'online' | 'away' | 'busy' | 'offline';
}