
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const usersService = {
    async getAll() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Profile[];
    },

    async updateRole(id: string, role: 'admin' | 'subscriber' | 'visitor') {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
