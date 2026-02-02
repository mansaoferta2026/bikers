import { supabase } from '../lib/supabase';

export const paymentsService = {
    async create(paymentData: {
        booking_id: string;
        amount: number;
        payment_method: string;
        transaction_id: string;
        status: string;
    }) {
        const { data, error } = await supabase
            .from('payments')
            .insert([paymentData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getByBookingId(bookingId: string) {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('booking_id', bookingId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
