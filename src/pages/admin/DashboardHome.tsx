
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';

// Mock Data
const DATA = [
    { name: 'Ene', income: 400000, users: 24 },
    { name: 'Feb', income: 300000, users: 18 },
    { name: 'Mar', income: 550000, users: 32 },
    { name: 'Abr', income: 450000, users: 28 },
    { name: 'May', income: 600000, users: 40 },
    { name: 'Jun', income: 700000, users: 45 },
];

export const DashboardHome = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Resumen General</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Ingresos Totales (Mes)</p>
                            <h3 className="text-2xl font-bold text-slate-900">$700.000</h3>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-xs text-green-600 flex items-center font-medium">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12.5% vs mes anterior
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Usuarios Registrados</p>
                            <h3 className="text-2xl font-bold text-slate-900">1,234</h3>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-xs text-blue-600 flex items-center font-medium">
                        +5 nuevos hoy
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Eventos Activos</p>
                            <h3 className="text-2xl font-bold text-slate-900">8</h3>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-xs text-slate-500">
                        3 próximos a cerrar inscripciones
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Tasa de Ocupación</p>
                            <h3 className="text-2xl font-bold text-slate-900">85%</h3>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-xs text-slate-500">
                        En eventos de este mes
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-bold mb-6">Ingresos Mensuales</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip />
                                <Bar dataKey="income" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-bold mb-6">Nuevos Usuarios</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
