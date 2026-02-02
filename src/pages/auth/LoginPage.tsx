
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
    const { signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            await signInWithGoogle();
            // Redirect happens via Supabase OAuth flow
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left side: Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary mb-10">
                        <Bike className="h-8 w-8" />
                        <span>MTB-X</span>
                    </Link>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenido de nuevo</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Ingresa para gestionar tus reservas y ver salidas exclusivas.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button
                            className="w-full h-12 text-base"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            isLoading={loading}
                        >
                            {!loading && (
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            )}
                            Continuar con Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-slate-500">O ingresa con email</span>
                            </div>
                        </div>

                        <div className="grid gap-4 opacity-50 pointer-events-none">
                            <input
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <Button className="w-full">Ingresar</Button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            (La autenticación por email/password esta deshabilitada, usa Google)
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side: Image */}
            <div className="hidden lg:block relative w-0 flex-1">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1596727147705-001d6749fa66?q=80&w=2670&auto=format&fit=crop"
                    alt="Mountain bike rider in nature"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
            </div>
        </div>
    );
};
