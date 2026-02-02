import { useState, useEffect } from 'react';
import { Check, X, Search } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { bookingsService } from '../../services/bookings';

export const AdminBookingsPage = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingsService.getAll();
            setBookings(data);
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
        try {
            await bookingsService.updateStatus(id, newStatus);
            // Optimistic update
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Error al actualizar el estado');
            // Reload to get correct state
            loadBookings();
        }
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Reservas</h1>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar reserva..."
                            className="pl-9 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="confirmed">Confirmados</option>
                        <option value="cancelled">Cancelados</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">Cargando reservas...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-slate-500 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Usuario</th>
                                    <th className="px-6 py-4">Evento</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Monto</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{booking.profiles?.full_name}</div>
                                            <div className="text-xs text-slate-500">{booking.profiles?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{booking.events?.title}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {booking.events?.start_date ? new Date(booking.events.start_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            ${booking.total_amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {booking.status === 'confirmed' ? 'Confirmado' :
                                                    booking.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="h-8 w-8 p-0 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200 shadow-none"
                                                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                                            title="Confirmar"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200 shadow-none"
                                                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                            title="Cancelar"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
