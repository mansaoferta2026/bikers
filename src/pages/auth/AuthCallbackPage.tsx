
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export const AuthCallbackPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Handle the OAuth callback
        const handleAuthCallback = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Error during auth callback:', error);
                    navigate('/login?error=auth_callback_failed');
                    return;
                }

                if (data.session) {
                    // Successful login
                    console.log('Session found, redirecting to dashboard/home');
                    // wait a brief moment for AuthContext to pick it up via onAuthStateChange if needed, 
                    // though getSession above also confirms it.
                    navigate('/'); // or /profile
                } else {
                    // No session found yet, maybe check url hash
                    console.warn('No session found in callback');
                    // If hash exists, Supabase client handles it, but we might need to wait
                    // Usually getSession() works if the URL contains the access_token
                    navigate('/login?error=no_session');
                }
            } catch (e) {
                console.error('Exception in auth callback:', e);
                navigate('/login?error=exception');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-900">Autenticando...</h2>
                <p className="text-slate-500">Por favor espera un momento.</p>
            </div>
        </div>
    );
};
