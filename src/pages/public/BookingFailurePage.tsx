import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const BookingFailurePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-lg">
                <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-12 w-12 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Pago Rechazado
                </h1>

                <p className="text-slate-600 mb-6">
                    No pudimos procesar tu pago. Por favor, intenta nuevamente con otro método de pago.
                </p>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate('/events')}
                    >
                        Volver a Eventos
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() => navigate(-1)}
                    >
                        Intentar Nuevamente
                    </Button>
                </div>
            </div>
        </div>
    );
};
