export interface Profile {
    id: number;
    name: string;
    age: number;
    bio: string;
    interests?: string[];
    profile_photo: string;
    gallery?: GalleryPhoto[];
    country: string;
    city: string;
    is_online: boolean;
    is_verified: boolean;
    online_status?: 'online' | 'away' | 'busy' | 'offline';
    last_seen_at?: string;
    created_at: string;
    is_featured?: boolean;
    featured_until?: string;
    assigned_at?: string;
}

export interface GalleryPhoto {
    id: number;
    photo_path: string;
    caption?: string;
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