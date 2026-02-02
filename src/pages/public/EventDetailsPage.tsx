import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, TrendingUp, User, Share2, ArrowLeft, Check, AlertCircle, Instagram, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { eventsService } from '../../services/events';
import { bookingsService } from '../../services/bookings';
import type { Database } from '../../types/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export const EventDetailsPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [participantCount, setParticipantCount] = useState(0);

    useEffect(() => {
        if (id) {
            loadEvent(id);
        }
    }, [id]);

    const loadEvent = async (eventId: string) => {
        try {
            setLoading(true);
            const [eventData, count] = await Promise.all([
                eventsService.getById(eventId),
                bookingsService.getParticipantCount(eventId)
            ]);
            setEvent(eventData);
            setParticipantCount(count);
        } catch (error) {
            console.error('Error loading event:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextImage = () => {
        if (!event?.images?.length) return;
        setCurrentImageIndex((prev) => (prev + 1) % event.images!.length);
    };

    const prevImage = () => {
        if (!event?.images?.length) return;
        setCurrentImageIndex((prev) => (prev - 1 + event.images!.length) % event.images!.length);
    };

    if (loading) return <div className="text-center py-20">Cargando evento...</div>;
    if (!event) return <div className="text-center py-20">Evento no encontrado</div>;

    const hasMultipleImages = event.images && event.images.length > 1;

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Gallery / Hero Carousel */}
            <div className="relative h-[400px] md:h-[500px] group">
                {event.images && event.images.length > 0 ? (
                    <>
                        {/* Image */}
                        <img
                            src={event.images[currentImageIndex]}
                            alt={`${event.title} - Imagen ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />

                        {/* Navigation Arrows */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                                >
                                    <ChevronLeft className="h-8 w-8" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </button>

                                {/* Indicators */}
                                <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {event.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/60 hover:bg-white/90'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                        Sin imagen
                    </div>
                )}

                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10">
                    <div className="container mx-auto pointer-events-auto">
                        <Link to="/events" className="inline-flex items-center text-white hover:text-primary transition-colors font-medium">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Volver al catálogo
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full uppercase tracking-wider mb-2">
                                        {event.type}
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{event.title}</h1>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Social Links */}
                                    {(event.instagram_url || event.tiktok_url) && (
                                        <div className="flex items-center gap-2 pr-4 mr-1 border-r border-gray-100">
                                            {event.instagram_url && (
                                                <a
                                                    href={event.instagram_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                                                    title="Ver en Instagram"
                                                >
                                                    <Instagram className="h-5 w-5" />
                                                </a>
                                            )}
                                            {event.tiktok_url && (
                                                <a
                                                    href={event.tiktok_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-slate-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                                                    title="Ver en TikTok"
                                                >
                                                    <Video className="h-5 w-5" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    <Button variant="outline" size="icon" title="Compartir">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg border">
                                <div className="text-center">
                                    <Calendar className="h-5 w-5 mx-auto text-primary mb-1" />
                                    <div className="text-sm font-semibold text-slate-900">
                                        {new Date(event.start_date).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} HS
                                    </div>
                                </div>
                                <div className="text-center border-l border-gray-200">
                                    <TrendingUp className="h-5 w-5 mx-auto text-primary mb-1" />
                                    <div className="text-sm font-semibold text-slate-900">{event.distance_km} km</div>
                                    <div className="text-xs text-muted-foreground">+{event.elevation_gain}m</div>
                                </div>
                                <div className="text-center border-l border-gray-200">
                                    <User className="h-5 w-5 mx-auto text-primary mb-1" />
                                    <div className="text-sm font-semibold text-slate-900">{event.difficulty}</div>
                                    <div className="text-xs text-muted-foreground">Nivel</div>
                                </div>
                                <div className="text-center border-l border-gray-200">
                                    <MapPin className="h-5 w-5 mx-auto text-primary mb-1" />
                                    <div className="text-sm font-semibold text-slate-900 truncate px-2">{event.meeting_point}</div>
                                    <div className="text-xs text-muted-foreground">Punto Encuentro</div>
                                </div>
                            </div>

                            <div className="prose max-w-none text-slate-600 mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Acerca de la salida</h3>
                                <p className="whitespace-pre-line">{event.description}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        Qué incluye
                                    </h3>
                                    <ul className="space-y-2">
                                        {event.includes?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-amber-500" />
                                        Requisitos
                                    </h3>
                                    <ul className="space-y-2">
                                        {event.requirements?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 overflow-hidden">
                            <h3 className="font-bold text-lg mb-4">Ubicación del encuentro</h3>
                            <div className="bg-gray-200 h-64 rounded-lg w-full flex items-center justify-center text-slate-400">
                                Mapa Interactivo (Próximamente)
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Booking CTA) */}
                    <div className="lg:w-80">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-violet-100">
                            <div className="text-center mb-6">
                                <p className="text-sm text-muted-foreground mb-1">Precio por persona</p>
                                <div className="text-4xl font-bold text-primary">
                                    {event.price === 0 ? 'GRATIS' : `$${event.price}`}
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Cupos totales:</span>
                                    <span className="font-medium">{event.max_participants}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Cupos disponibles:</span>
                                    <span className={`font-medium ${event.max_participants && participantCount >= event.max_participants ? 'text-red-600' : 'text-green-600'}`}>
                                        {event.max_participants ? Math.max(0, event.max_participants - participantCount) : 'Unlimited'}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full ${event.max_participants && participantCount >= event.max_participants ? 'bg-red-500' : 'bg-primary'}`}
                                        style={{ width: `${event.max_participants ? Math.min(100, (participantCount / event.max_participants) * 100) : 0}%` }}
                                    />
                                </div>
                            </div>

                            {event.max_participants && participantCount >= event.max_participants ? (
                                <Button className="w-full h-12 text-lg font-semibold shadow-lg bg-gray-400 cursor-not-allowed hover:bg-gray-400 mb-4" disabled>
                                    AGOTADO
                                </Button>
                            ) : (
                                <Link to={`/booking/${event.id}`}>
                                    <Button className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/25 mb-4">
                                        Reservar Cupo
                                    </Button>
                                </Link>
                            )}

                            <p className="text-xs text-center text-muted-foreground">
                                {event.price === 0
                                    ? 'Reserva gratuita. Cupos limitados.'
                                    : 'Reserva segura. Puedes cancelar hasta 48hs antes.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
