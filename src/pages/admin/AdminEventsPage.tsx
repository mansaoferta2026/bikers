
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { eventsService } from '../../services/events';
import type { Database } from '../../types/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export const AdminEventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        loadEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este evento?')) {
            try {
                await eventsService.delete(id);
                setEvents(events.filter(e => e.id !== id));
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Error al eliminar evento');
            }
        }
    };

    const loadEvents = async () => {
        try {
            const data = await eventsService.getAll();
            setEvents(data);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Gestión de Eventos</h1>
                <Link to="/admin/events/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Nuevo Evento
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-slate-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Cupos</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{event.title}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(event.start_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {event.max_participants}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">${event.price}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/events/${event.id}`}>
                                                <button className="p-2 hover:bg-gray-100 rounded-full text-slate-500 hover:text-primary" title="Ver Evento Público">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            <Link to={`/admin/events/${event.id}`}>
                                                <button className="p-2 hover:bg-gray-100 rounded-full text-slate-500 hover:text-blue-600" title="Editar">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            <button
                                                className="p-2 hover:bg-gray-100 rounded-full text-slate-500 hover:text-red-600"
                                                title="Eliminar"
                                                onClick={() => handleDelete(event.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
