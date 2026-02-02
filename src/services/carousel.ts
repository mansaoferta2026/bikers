import { supabase } from '../lib/supabase';

export interface CarouselSlide {
    id: string;
    title: string;
    subtitle?: string;
    image_url: string;
    cta_text?: string;
    cta_link?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const carouselService = {
    /**
     * Get all carousel slides (admin view)
     */
    async getAll(): Promise<CarouselSlide[]> {
        const { data, error } = await supabase
            .from('landing_carousel')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get only active slides (public view)
     */
    async getActive(): Promise<CarouselSlide[]> {
        const { data, error } = await supabase
            .from('landing_carousel')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Create a new slide
     */
    async create(slide: {
        title: string;
        subtitle?: string;
        image_url: string;
        cta_text?: string;
        cta_link?: string;
        display_order?: number;
    }): Promise<CarouselSlide> {
        // Get the highest display_order
        const { data: maxOrder } = await supabase
            .from('landing_carousel')
            .select('display_order')
            .order('display_order', { ascending: false })
            .limit(1)
            .single();

        const newOrder = slide.display_order ?? (maxOrder?.display_order ?? 0) + 1;

        const { data, error } = await supabase
            .from('landing_carousel')
            .insert([{ ...slide, display_order: newOrder }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update a slide
     */
    async update(id: string, updates: Partial<CarouselSlide>): Promise<CarouselSlide> {
        const { data, error } = await supabase
            .from('landing_carousel')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a slide
     */
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('landing_carousel')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Reorder slides
     */
    async reorder(slides: Array<{ id: string; display_order: number }>): Promise<void> {
        const updates = slides.map(slide =>
            supabase
                .from('landing_carousel')
                .update({ display_order: slide.display_order })
                .eq('id', slide.id)
        );

        const results = await Promise.all(updates);
        const errors = results.filter(r => r.error);

        if (errors.length > 0) {
            throw new Error('Failed to reorder some slides');
        }
    },

    /**
     * Toggle slide active status
     */
    async toggleActive(id: string, isActive: boolean): Promise<CarouselSlide> {
        const { data, error } = await supabase
            .from('landing_carousel')
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
