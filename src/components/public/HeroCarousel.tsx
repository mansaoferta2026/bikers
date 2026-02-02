import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { carouselService, type CarouselSlide } from '../../services/carousel';

export const HeroCarousel = () => {
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSlides = async () => {
            try {
                const activeSlides = await carouselService.getActive();
                setSlides(activeSlides);
            } catch (error) {
                console.error('Error loading carousel:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSlides();
    }, []);

    // Auto-advance
    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (loading) {
        return <div className="h-[600px] bg-slate-100 animate-pulse" />;
    }

    // Fallback if no slides
    if (slides.length === 0) {
        return (
            <section className="relative h-[600px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1544182383-0645ce12339d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                        filter: 'brightness(0.6)'
                    }}
                />
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Desafía tus límites
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
                        Únete a la comunidad más activa de mountain bike. Salidas organizadas, rutas épicas y experiencias inolvidables.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/events">
                            <Button size="lg" className="w-full md:w-auto text-lg h-14">
                                Ver Próximas Salidas
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-[600px] overflow-hidden group">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url("${slide.image_url}")`,
                            filter: 'brightness(0.6)'
                        }}
                    />

                    {/* Content */}
                    <div className="relative h-full flex items-center justify-center text-white p-4">
                        <div className="container mx-auto text-center">
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in-up">
                                {slide.title}
                            </h1>
                            {slide.subtitle && (
                                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90 animate-fade-in-up delay-100">
                                    {slide.subtitle}
                                </p>
                            )}
                            {(slide.cta_text && slide.cta_link) && (
                                <div className="flex justify-center animate-fade-in-up delay-200">
                                    <Link to={slide.cta_link}>
                                        <Button size="lg" className="text-lg h-14">
                                            {slide.cta_text}
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};
