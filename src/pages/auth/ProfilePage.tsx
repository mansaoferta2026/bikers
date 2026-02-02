
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';

const profileSchema = z.object({
    full_name: z.string().min(2, 'El nombre es muy corto'),
    phone: z.string().min(6, 'Teléfono inválido'),
    bike_size: z.string().optional(),
    experience_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
    const { profile, user } = useAuth();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: profile?.full_name || '',
            phone: profile?.phone || '',
            bike_size: profile?.bike_size || '',
            // @ts-ignore - enum casing might conflict initially if DB uses lowercase
            experience_level: profile?.experience_level || 'beginner',
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            setSuccess(false);
            setError(null);

            const { error: updateError } = await supabase
                .from('profiles')
                .update(data)
                .eq('id', user?.id);

            if (updateError) throw updateError;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

            <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
                <h2 className="text-xl font-semibold mb-6">Información Personal</h2>

                {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm border border-green-200">
                        Perfil actualizado correctamente.
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre Completo</label>
                            <input
                                {...form.register('full_name')}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {form.formState.errors.full_name && (
                                <p className="text-xs text-red-500">{form.formState.errors.full_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email (no editable)</label>
                            <input
                                value={user?.email}
                                disabled
                                className="flex h-10 w-full rounded-md border border-input bg-slate-100 px-3 py-2 text-sm opacity-75"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Teléfono</label>
                            <input
                                {...form.register('phone')}
                                placeholder="+54 9 11 ..."
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {form.formState.errors.phone && (
                                <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nivel de Experiencia</label>
                            <select
                                {...form.register('experience_level')}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="beginner">Principiante</option>
                                <option value="intermediate">Intermedio</option>
                                <option value="advanced">Avanzado</option>
                                <option value="expert">Experto</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Talla de Bicicleta</label>
                            <input
                                {...form.register('bike_size')}
                                placeholder="ej: M, L, 18.5"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" isLoading={form.formState.isSubmitting}>
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
