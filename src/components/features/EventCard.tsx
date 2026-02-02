
import { Calendar, MapPin, TrendingUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Database } from '../../types/database.types';
import { Button } from '../common/Button';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCardProps {
    event: Partial<Event>;
}

export const EventCard = ({ event }: EventCardProps) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-full uppercase tracking-wider text-primary">
                        {event.type}
                    </span>
                </div>
                <img
                    src={event.images?.[0] || "https://images.unsplash.com/photo-1544182383-0645ce12339d?w=800&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.start_date)}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold line-clamp-2 text-slate-900 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>
                    <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-primary">${event.price}</span>
                    </div>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{event.meeting_point || 'Ubicación por definir'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-slate-400" />
                            <span>{event.distance_km}km</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-slate-400" />
                            <span>Nivel {event.difficulty}</span>
                        </div>
                    </div>
                </div>

                <Link to={`/events/${event.id}`} className="mt-auto">
                    <Button className="w-full" variant="outline">
                        Ver Detalles
                    </Button>
                </Link>
            </div>
        </div>
    );
};
