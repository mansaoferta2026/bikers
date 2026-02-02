
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bike, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const Header = () => {
    const { user, profile, signOut, isAdmin } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Salidas', path: '/events' },
        { name: 'Suscripciones', path: '/subscriptions' },
        ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl md:text-2xl text-primary">
                    <Bike className="h-6 w-6 md:h-8 md:w-8" />
                    <span>MTB-X</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Hola, {profile?.full_name?.split(' ')[0] || 'Usuario'}
                            </span>
                            <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Salir
                            </Button>
                            <Link to="/profile">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="h-4 w-4" />
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm">Registrarse</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t p-4 bg-background">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t pt-4 mt-2">
                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Cuenta: {profile?.full_name}</span>
                                    </div>
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-start">
                                            <User className="mr-2 h-4 w-4" />
                                            Mi Perfil
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Cerrar Sesión
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="secondary" className="w-full">Iniciar Sesión</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full">Registrarse</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};
