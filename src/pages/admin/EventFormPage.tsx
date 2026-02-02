
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, Trash, Instagram, Video } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { eventsService } from '../../services/events';

// Schema
const eventSchema = z.object({
    title: z.string().min(3, 'Título requerido'),
    description: z.string().min(10, 'Descripción requerida'),
    type: z.enum(['local', 'provincial', 'international']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    date: z.string().min(1, 'Fecha requerida'),
    time: z.string().min(1, 'Hora requerida'), // Helper for UI
    price: z.coerce.number().min(0),
    max_participants: z.coerce.number().min(1),
    distance_km: z.coerce.number().min(0),
    elevation_gain: z.coerce.number().min(0),
    meeting_point: z.string().min(3, 'Punto de encuentro requerido'),
    includes: z.array(z.object({ value: z.string() })),
    requirements: z.array(z.object({ value: z.string() })),
    status: z.enum(['published', 'draft', 'cancelled', 'finished']),
    instagram_url: z.string().optional().or(z.literal('')),
    tiktok_url: z.string().optional().or(z.literal('')),
    image1: z.string().optional(),
    image2: z.string().optional(),
    image3: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export const EventFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [loading, setLoading] = useState(false);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema) as any,
        defaultValues: {
            title: '',
            description: '',
            type: 'local',
            difficulty: 'intermediate',
            price: 0,
            max_participants: 10,
            status: 'draft',
            includes: [{ value: 'Guía' }, { value: 'Seguro' }],
            requirements: [{ value: 'Casco' }, { value: 'Bicicleta MTB' }],
            instagram_url: '',
            tiktok_url: '',
            image1: '',
            image2: '',
            image3: '',
        },
    });

    const { fields: includeFields, append: appendInclude, remove: removeInclude } = useFieldArray({
        control: form.control,
        name: 'includes',
    });

    const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({
        control: form.control,
        name: 'requirements',
    });

    useEffect(() => {
        if (isEditing && id) {
            loadEvent(id);
        }
    }, [id, isEditing]);

    const loadEvent = async (eventId: string) => {
        try {
            setLoading(true);
            const event = await eventsService.getById(eventId);

            // Convert UTC start_date back to local date and time inputs
            const dateObj = new Date(event.start_date);
            const dateStr = dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0');
            const timeStr = String(dateObj.getHours()).padStart(2, '0') + ':' + String(dateObj.getMinutes()).padStart(2, '0');

            form.reset({
                title: event.title,
                description: event.description || '',
                type: event.type,
                difficulty: event.difficulty,
                price: event.price,
                max_participants: event.max_participants || 0,
                status: event.status || 'draft',
                distance_km: event.distance_km || 0,
                elevation_gain: event.elevation_gain || 0,
                meeting_point: event.meeting_point || '',
                date: dateStr,
                time: timeStr,
                includes: event.includes ? event.includes.map((i: string) => ({ value: i })) : [],
                requirements: event.requirements ? event.requirements.map((r: string) => ({ value: r })) : [],
                instagram_url: event.instagram_url || '',
                tiktok_url: event.tiktok_url || '',
                image1: event.images?.[0] || '',
                image2: event.images?.[1] || '',
                image3: event.images?.[2] || '',
            });
        } catch (error) {
            console.error('Error loading event:', error);
            alert('Error al cargar el evento');
            navigate('/admin/events');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
        try {
            setLoading(true);

            // Combine images
            const images = [data.image1, data.image2, data.image3].filter(img => img && img.trim() !== '');

            // Combine date and time
            const datetime = new Date(`${data.date}T${data.time}`).toISOString();
            const eventData = {
                title: data.title,
                description: data.description,
                type: data.type,
                difficulty: data.difficulty,
                price: data.price,
                max_participants: data.max_participants,
                status: data.status,
                distance_km: data.distance_km,
                elevation_gain: data.elevation_gain,
                meeting_point: data.meeting_point,
                instagram_url: data.instagram_url,
                tiktok_url: data.tiktok_url,
                start_date: datetime,
                // Flat arrays for DB
                includes: data.includes.map((i: { value: string }) => i.value),
                requirements: data.requirements.map((r: { value: string }) => r.value),
                images: images,
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('events')
                    .insert([eventData]);
                if (error) throw error;
            }

            navigate('/admin/events');
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error saving event. Check console. (Note: Ensure DB is connected)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" type="button" onClick={() => navigate('/admin/events')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <h1 className="text-3xl font-bold text-slate-900">
                    {isEditing ? 'Editar Evento' : 'Nuevo Evento'}
                </h1>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                    <h2 className="font-semibold text-lg border-b pb-2">Información Básica</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Título</label>
                            <input {...form.register('title')} className="w-full p-2 border rounded-md" />
                            {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado</label>
                            <select {...form.register('status')} className="w-full p-2 border rounded-md">
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                                <option value="cancelled">Cancelado</option>
                                <option value="finished">Finalizado</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Descripción</label>
                            <textarea {...form.register('description')} rows={4} className="w-full p-2 border rounded-md" />
                            {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo</label>
                            <select {...form.register('type')} className="w-full p-2 border rounded-md">
                                <option value="local">Local</option>
                                <option value="provincial">Provincial</option>
                                <option value="international">Internacional</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Dificultad</label>
                            <select {...form.register('difficulty')} className="w-full p-2 border rounded-md">
                                <option value="beginner">Principiante</option>
                                <option value="intermediate">Intermedio</option>
                                <option value="advanced">Avanzado</option>
                                <option value="expert">Experto</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Multimedia & Social */}
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                    <h2 className="font-semibold text-lg border-b pb-2">Multimedia y Redes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Imágenes del Evento (Carrusel)</label>
                            <div className="grid gap-3">
                                <input {...form.register('image1')} placeholder="URL Imagen Principal" className="w-full p-2 border rounded-md" />
                                <input {...form.register('image2')} placeholder="URL Imagen 2 (Opcional)" className="w-full p-2 border rounded-md" />
                                <input {...form.register('image3')} placeholder="URL Imagen 3 (Opcional)" className="w-full p-2 border rounded-md" />
                            </div>
                            <p className="text-xs text-muted-foreground">Pega las URL directas de las imágenes. La primera será la portada.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Instagram className="h-4 w-4" /> Instagram Link
                            </label>
                            <input {...form.register('instagram_url')} placeholder="https://instagram.com/..." className="w-full p-2 border rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Video className="h-4 w-4" /> TikTok Link
                            </label>
                            <input {...form.register('tiktok_url')} placeholder="https://tiktok.com/..." className="w-full p-2 border rounded-md" />
                        </div>
                    </div>
                </div>

                {/* Logistics */}
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                    <h2 className="font-semibold text-lg border-b pb-2">Logística y Precios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Fecha</label>
                            <input type="date" {...form.register('date')} className="w-full p-2 border rounded-md" />
                            {form.formState.errors.date && <p className="text-xs text-red-500">{form.formState.errors.date.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hora</label>
                            <input type="time" {...form.register('time')} className="w-full p-2 border rounded-md" />
                            {form.formState.errors.time && <p className="text-xs text-red-500">{form.formState.errors.time.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Precio ($)</label>
                            <input type="number" {...form.register('price')} className="w-full p-2 border rounded-md" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Distancia (km)</label>
                            <input type="number" step="0.1" {...form.register('distance_km')} className="w-full p-2 border rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Desnivel (m)</label>
                            <input type="number" {...form.register('elevation_gain')} className="w-full p-2 border rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cupos Máximos</label>
                            <input type="number" {...form.register('max_participants')} className="w-full p-2 border rounded-md" />
                        </div>

                        <div className="space-y-2 md:col-span-3">
                            <label className="text-sm font-medium">Punto de Encuentro</label>
                            <input {...form.register('meeting_point')} className="w-full p-2 border rounded-md" />
                            {form.formState.errors.meeting_point && <p className="text-xs text-red-500">{form.formState.errors.meeting_point.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-lg">Qué Incluye</h2>
                            <Button type="button" size="sm" variant="outline" onClick={() => appendInclude({ value: '' })}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {includeFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        {...form.register(`includes.${index}.value`)}
                                        className="flex-1 p-2 border rounded-md text-sm"
                                        placeholder="Ej: Seguro médico"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeInclude(index)}>
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-lg">Requisitos</h2>
                            <Button type="button" size="sm" variant="outline" onClick={() => appendReq({ value: '' })}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {reqFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        {...form.register(`requirements.${index}.value`)}
                                        className="flex-1 p-2 border rounded-md text-sm"
                                        placeholder="Ej: Casco homologado"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeReq(index)}>
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/events')}>
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        {isEditing ? 'Guardar Cambios' : 'Crear Evento'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

