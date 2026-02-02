import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { eventsService } from '../../services/events';
import { bookingsService } from '../../services/bookings';
import type { Database } from '../../types/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState<Event | null>(null);
    const [loadingEvent, setLoadingEvent] = useState(true);

    useEffect(() => {
        if (id) {
            loadEvent(id);
        }
    }, [id]);

    const loadEvent = async (eventId: string) => {
        try {
            setLoadingEvent(true);
            const data = await eventsService.getById(eventId);
            setEvent(data);
        } catch (error) {
            console.error('Error loading event:', error);
            alert('Error al cargar el evento');
            navigate('/events');
        } finally {
            setLoadingEvent(false);
        }
    };

    const handlePayment = async () => {
        if (!user || !event) return;

        setLoading(true);
        try {
            // Create booking in database first
            const booking = await bookingsService.create({
                event_id: event.id,
                user_id: user.id,
                participants_count: 1,
                total_amount: event.price,
                additional_info: {
                    payment_method: 'mercadopago',
                    payment_date: new Date().toISOString()
                }
            });

            // Create Mercado Pago payment preference
            const { mercadopagoService } = await import('../../services/mercadopago');
            const initPoint = await mercadopagoService.createPaymentPreference({
                booking_id: booking.id,
                title: `Reserva: ${event.title}`,
                amount: event.price,
                payer_email: user.email || '',
                payer_name: user.user_metadata?.full_name || user.email || 'Usuario',
            });

            // Redirect to Mercado Pago checkout
            window.location.href = initPoint;

        } catch (error) {
            console.error('Error creating payment:', error);
            alert('Error al procesar el pago. Por favor intenta nuevamente.');
            setLoading(false);
        }
    };

    if (loadingEvent) {
        return <div className="text-center py-20">Cargando evento...</div>;
    }


    if (!event) {
        return <div className="text-center py-20">Evento no encontrado</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Confirmar Reserva</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
                    <h3 className="font-bold text-lg mb-4">Resumen del Evento</h3>
                    <div className="flex items-start gap-4 mb-6">
                        <img
                            src="https://images.unsplash.com/photo-1576435728678-38d01d52e38b?w=200&q=80"
                            alt="Event"
                            className="w-24 h-24 rounded-md object-cover"
                        />
                        <div>
                            <h4 className="font-semibold text-slate-900">{event.title}</h4>
                            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(event.start_date).toLocaleDateString()} - {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-lg font-bold text-primary mt-2">
                                ${event.price}
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Subtotal</span>
                            <span>${event.price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Cargo por servicio</span>
                            <span>$0</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                            <span>Total</span>
                            <span>${event.price}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Payment Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Método de Pago
                    </h3>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre en la tarjeta</label>
                            <input
                                type="text"
                                defaultValue={user?.user_metadata?.full_name || ''}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Número de tarjeta</label>
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Vencimiento</label>
                                <input type="text" placeholder="MM/YY" className="w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">CVC</label>
                                <input type="text" placeholder="123" className="w-full p-2 border rounded-md" />
                            </div>
                        </div>

                        {/* Mock Payment Selector */}
                        <div className="flex gap-2 mt-4 mb-6">
                            <div className="border p-2 rounded cursor-pointer hover:border-primary border-primary bg-primary/5">
                                Tarjeta Crédito
                            </div>
                            <div className="border p-2 rounded cursor-pointer hover:border-primary opacity-50">
                                Mercado Pago
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-lg"
                            onClick={handlePayment}
                            type="button"
                            isLoading={loading}
                        >
                            Pagar ${event.price}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Tus datos están protegidos con encriptación SSL de 256 bits.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
