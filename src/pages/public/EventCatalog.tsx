
import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { EventCard } from '../../components/features/EventCard';
import { Button } from '../../components/common/Button';
import { eventsService } from '../../services/events';
import type { Database } from '../../types/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export const EventCatalog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await eventsService.getPublished();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = selectedDifficulty ? event.difficulty === selectedDifficulty : true;
        return matchesSearch && matchesDifficulty;
    });

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Próximas Salidas</h1>
                        <p className="text-muted-foreground mt-1">Explora nuestras aventuras programadas</p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar eventos..."
                                className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Filters Panel (Mobile/Desktop Toggle) */}
                {showFilters && (
                    <div className="mb-8 p-4 bg-white rounded-lg border shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-sm">Filtros</h3>
                            <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedDifficulty === level
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20">Cargando eventos...</div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">No se encontraron eventos con estos criterios.</p>
                        <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedDifficulty(null); }}>
                            Limpiar filtros
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
