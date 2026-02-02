
import { supabase } from '../lib/supabase';





export const bookingsService = {
    async create(bookingData: {
        event_id: string;
        user_id: string;
        participants_count: number;
        total_amount: number;
        additional_info?: any;
    }) {
        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        profiles:user_id (full_name, email),
        events:event_id (title, start_date)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getByUserId(userId: string) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        events:event_id (title, start_date, price, meeting_point)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
