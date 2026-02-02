import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { bookingsService } from '../../services/bookings';

export const BookingSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference'); // booking_id

    useEffect(() => {
        const processPayment = async () => {
            if (!externalReference || !paymentId) {
                setError('Información de pago incompleta');
                setProcessing(false);
                return;
            }

            try {
                // Update booking status to confirmed
                await bookingsService.updateStatus(externalReference, 'confirmed');

                // Create payment record
                const { paymentsService } = await import('../../services/payments');
                await paymentsService.create({
                    booking_id: externalReference,
                    amount: 0, // Will be updated from MP webhook
                    payment_method: 'mercadopago',
                    transaction_id: paymentId,
                    status: status || 'approved',
                });

                // Get booking details for email
                // Note: Email sending will be handled by webhook in production

                setProcessing(false);
            } catch (err) {
                console.error('Error processing payment:', err);
                setError('Error al procesar el pago');
                setProcessing(false);
            }
        };

        processPayment();
    }, [externalReference, paymentId, status]);

    if (processing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-lg text-slate-600">Procesando tu pago...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                        {error}
                    </div>
                    <Button onClick={() => navigate('/events')}>
                        Volver a Eventos
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-lg">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    ¡Pago Exitoso!
                </h1>

                <p className="text-slate-600 mb-2">
                    Tu reserva ha sido confirmada exitosamente.
                </p>

                <p className="text-sm text-slate-500 mb-6">
                    Recibirás un email de confirmación con los detalles de tu reserva.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-500">ID de Pago:</span>
                        <span className="font-medium">{paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Estado:</span>
                        <span className="font-medium text-green-600">Aprobado</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate('/profile')}
                    >
                        Ver Mis Reservas
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() => navigate('/events')}
                    >
                        Explorar Eventos
                    </Button>
                </div>
            </div>
        </div>
    );
};
