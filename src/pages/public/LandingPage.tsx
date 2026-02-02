
import { Mountain, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { HeroCarousel } from '../../components/public/HeroCarousel';

export const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            {/* Hero Section */}
            <HeroCarousel />

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                <Mountain className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Rutas Seleccionadas</h3>
                            <p className="text-muted-foreground">
                                Recorridos diseñados por expertos para todos los niveles, desde principiantes hasta pro-riders.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                <Shield className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Seguridad Total</h3>
                            <p className="text-muted-foreground">
                                Guías certificados, seguros incluidos y soporte mecánico en todas nuestras salidas.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Comunidad Activa</h3>
                            <p className="text-muted-foreground">
                                Conoce a otros apasionados del MTB. Más que deporte, creamos amistades duraderas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2 text-primary">500+</div>
                            <div className="text-sm text-slate-400">Salidas Realizadas</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2 text-primary">12k</div>
                            <div className="text-sm text-slate-400">Km Recorridos</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2 text-primary">1500+</div>
                            <div className="text-sm text-slate-400">Riders Felices</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2 text-primary">50+</div>
                            <div className="text-sm text-slate-400">Rutas Únicas</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para la aventura?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Suscríbete a nuestros planes y obtén beneficios exclusivos, o reserva tu primera salida hoy mismo.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button size="lg" variant="default">Crear Cuenta Gratis</Button>
                        </Link>
                        <Link to="/subscriptions">
                            <Button size="lg" variant="outline">Ver Planes</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
