
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    phone: string | null
                    experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
                    bike_size: string | null
                    role: 'admin' | 'subscriber' | 'visitor'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    phone?: string | null
                    experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
                    bike_size?: string | null
                    role?: 'admin' | 'subscriber' | 'visitor'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    phone?: string | null
                    experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
                    bike_size?: string | null
                    role?: 'admin' | 'subscriber' | 'visitor'
                    created_at?: string
                    updated_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    type: 'local' | 'provincial' | 'international'
                    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
                    start_date: string
                    duration: string | null
                    distance_km: number | null
                    elevation_gain: number | null
                    meeting_point: string | null
                    location_lat: number | null
                    location_lng: number | null
                    max_participants: number | null
                    price: number
                    images: string[] | null
                    includes: string[] | null
                    requirements: string[] | null
                    status: 'published' | 'draft' | 'cancelled' | 'finished'
                    instagram_url: string | null
                    tiktok_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    type: 'local' | 'provincial' | 'international'
                    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
                    start_date: string
                    duration?: string | null
                    distance_km?: number | null
                    elevation_gain?: number | null
                    meeting_point?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    max_participants?: number | null
                    price: number
                    images?: string[] | null
                    includes?: string[] | null
                    requirements?: string[] | null
                    status?: 'published' | 'draft' | 'cancelled' | 'finished'
                    instagram_url?: string | null
                    tiktok_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    type?: 'local' | 'provincial' | 'international'
                    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
                    start_date?: string
                    duration?: string | null
                    distance_km?: number | null
                    elevation_gain?: number | null
                    meeting_point?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    max_participants?: number | null
                    price?: number
                    images?: string[] | null
                    includes?: string[] | null
                    requirements?: string[] | null
                    status?: 'published' | 'draft' | 'cancelled' | 'finished'
                    instagram_url?: string | null
                    tiktok_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    event_id: string
                    user_id: string
                    participants_count: number
                    total_amount: number
                    status: 'pending' | 'confirmed' | 'cancelled'
                    payment_status: 'pending' | 'completed' | 'refunded'
                    additional_info: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    user_id: string
                    participants_count?: number
                    total_amount: number
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    payment_status?: 'pending' | 'completed' | 'refunded'
                    additional_info?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    user_id?: string
                    participants_count?: number
                    total_amount?: number
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    payment_status?: 'pending' | 'completed' | 'refunded'
                    additional_info?: Json | null
                    created_at?: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    plan_type: 'monthly' | 'annual'
                    status: 'active' | 'inactive' | 'cancelled'
                    start_date: string
                    end_date: string | null
                    amount: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    plan_type: 'monthly' | 'annual'
                    status?: 'active' | 'inactive' | 'cancelled'
                    start_date?: string
                    end_date?: string | null
                    amount: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    plan_type?: 'monthly' | 'annual'
                    status?: 'active' | 'inactive' | 'cancelled'
                    start_date?: string
                    end_date?: string | null
                    amount?: number
                    created_at?: string
                }
            }
            payments: {
                Row: {
                    id: string
                    booking_id: string
                    amount: number
                    payment_method: string | null
                    transaction_id: string | null
                    status: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    booking_id: string
                    amount: number
                    payment_method?: string | null
                    transaction_id?: string | null
                    status?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    booking_id?: string
                    amount?: number
                    payment_method?: string | null
                    transaction_id?: string | null
                    status?: string | null
                    created_at?: string
                }
            }
        }
    }
}
