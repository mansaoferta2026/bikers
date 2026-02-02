
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ requiredRole }: { requiredRole?: 'admin' | 'subscriber' }) => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && profile?.role !== requiredRole && profile?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
