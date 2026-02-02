
import { Check } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const SubscriptionPage = () => {
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Plan Mensual',
            price: '$5.000',
            period: '/mes',
            description: 'Ideal para ciclistas ocasionales.',
            features: [
                'Acceso a todas las salidas locales',
                'Seguro de accidentes básico',
                'Descuento del 10% en eventos especiales',
                'Acceso a la comunidad de WhatsApp'
            ],
            popular: false,
            buttonText: 'Suscribirse Mensual',
            action: () => navigate('/register?plan=monthly') // Or handle integration
        },
        {
            name: 'Plan Anual',
            price: '$50.000',
            period: '/año',
            description: 'Para los verdaderos apasionados del MTB.',
            features: [
                'Todo lo del Plan Mensual',
                '2 meses gratis (ahorras $10.000)',
                'Jersey oficial del club de regalo',
                'Prioridad en cupos para viajes',
                'Mantenimiento básico de bicicleta semestral'
            ],
            popular: true,
            buttonText: 'Suscribirse Anual',
            action: () => navigate('/register?plan=annual')
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Elige tu Plan y Únete al Club</h1>
                    <p className="text-lg text-slate-600">
                        Disfruta de beneficios exclusivos, salidas organizadas y una comunidad que comparte tu pasión.
                        Sin compromisos, cancela cuando quieras.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-white rounded-2xl shadow-lg border p-8 flex flex-col hover:shadow-xl transition-all hover:-translate-y-1
                ${plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100'}
              `}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Más Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                    <span className="text-slate-500">{plan.period}</span>
                                </div>
                                <p className="text-slate-500 mt-4">{plan.description}</p>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-slate-600 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={plan.action}
                                className={`w-full h-12 text-lg ${plan.popular ? 'bg-primary' : 'bg-slate-900 hover:bg-slate-800'}`}
                            >
                                {plan.buttonText}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <h3 className="text-xl font-bold mb-4">¿Tienes dudas?</h3>
                    <p className="text-slate-600 mb-6">Contáctanos directamente y te ayudaremos a elegir la mejor opción para ti.</p>
                    <Button variant="outline">Contactar Soporte</Button>
                </div>

            </div>
        </div>
    );
};
