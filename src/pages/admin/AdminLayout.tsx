
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, BarChart3, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export const AdminLayout = () => {
    const { pathname } = useLocation();
    const { signOut } = useAuth();

    const links = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Eventos', path: '/admin/events', icon: Calendar },
        { name: 'Reservas', path: '/admin/bookings', icon: ShieldCheck },
        { name: 'Usuarios', path: '/admin/users', icon: Users },
        { name: 'Finanzas', path: '/admin/finance', icon: BarChart3 },
        { name: 'Configuración', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold tracking-wider flex items-center gap-2">
                        <ShieldCheck className="text-primary" />
                        ADMIN PANEL
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.path === '/admin' ? pathname === '/admin' : pathname.startsWith(link.path);

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-white"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
