
import { supabase } from '../lib/supabase';




export const eventsService = {
    async getAll() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('start_date', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getPublished() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('status', 'published')
            .order('start_date', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
