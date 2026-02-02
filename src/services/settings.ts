import { supabase } from '../lib/supabase';

export interface SiteSetting {
    id: string;
    category: string;
    key: string;
    value: any;
    description?: string;
    updated_at: string;
    updated_by?: string;
}

export const settingsService = {
    /**
     * Get a single setting by category and key
     */
    async getSetting(category: string, key: string): Promise<any> {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('category', category)
            .eq('key', key)
            .single();

        if (error) {
            console.error('Error fetching setting:', error);
            return null;
        }
        return data?.value;
    },

    /**
     * Get all settings by category
     */
    async getSettingsByCategory(category: string): Promise<SiteSetting[]> {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('category', category)
            .order('key');

        if (error) throw error;
        return data || [];
    },

    /**
     * Get all settings as a key-value map
     */
    async getAllSettings(): Promise<Record<string, any>> {
        const { data, error } = await supabase
            .from('site_settings')
            .select('category, key, value');

        if (error) throw error;

        const settings: Record<string, any> = {};
        data?.forEach(setting => {
            const fullKey = `${setting.category}.${setting.key}`;
            settings[fullKey] = setting.value;
        });

        return settings;
    },

    /**
     * Update or insert a setting
     */
    async upsertSetting(
        category: string,
        key: string,
        value: any,
        description?: string
    ): Promise<SiteSetting> {
        const { data, error } = await supabase
            .from('site_settings')
            .upsert({
                category,
                key,
                value,
                description
            }, {
                onConflict: 'category,key'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Bulk update settings
     */
    async bulkUpdateSettings(settings: Array<{
        category: string;
        key: string;
        value: any;
        description?: string;
    }>): Promise<void> {
        const { error } = await supabase
            .from('site_settings')
            .upsert(settings, {
                onConflict: 'category,key'
            });

        if (error) throw error;
    },

    /**
     * Delete a setting
     */
    async deleteSetting(category: string, key: string): Promise<void> {
        const { error } = await supabase
            .from('site_settings')
            .delete()
            .eq('category', category)
            .eq('key', key);

        if (error) throw error;
    }
};
