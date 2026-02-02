import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const BookingPendingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-lg">
                <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-12 w-12 text-yellow-600" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Pago Pendiente
                </h1>

                <p className="text-slate-600 mb-2">
                    Tu pago está siendo procesado.
                </p>

                <p className="text-sm text-slate-500 mb-6">
                    Te notificaremos por email cuando se confirme el pago.
                </p>

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
