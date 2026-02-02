
import { useState, useEffect } from 'react';
import { ShieldAlert, User } from 'lucide-react';

// Mock Data
const MOCK_USERS = [
    { id: '1', full_name: 'Admin User', email: 'admin@mtb.com', role: 'admin', created_at: '2024-01-01' },
    { id: '2', full_name: 'Juan Perez', email: 'juan@test.com', role: 'subscriber', created_at: '2024-01-15' },
    { id: '3', full_name: 'Visitante Nuevo', email: 'vistor@test.com', role: 'visitor', created_at: '2024-01-20' },
];

export const AdminUsersPage = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        // In real app used usersService.getAll()
        setUsers(MOCK_USERS);
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Usuarios</h1>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-slate-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Fecha Registro</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{user.full_name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize gap-1
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {user.role === 'admin' && <ShieldAlert className="h-3 w-3" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {user.created_at}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <select
                                        className="text-xs border rounded p-1"
                                        defaultValue={user.role}
                                    >
                                        <option value="visitor">Visitante</option>
                                        <option value="subscriber">Suscriptor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
