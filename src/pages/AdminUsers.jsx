import React, { useState, useEffect } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import api from '../services/api';
import { Mail, User as UserIcon, Calendar } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-sapphire-950">Gestión de Usuarios</h1>
          <p className="text-gray-500">Administra los accesos y roles de la plataforma.</p>
        </header>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Usuario</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Rol</th>
                <th className="px-8 py-5">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.userId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sapphire-100 flex items-center justify-center text-sapphire-700 text-xs font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-500 text-sm">{u.email}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-gray-400 text-sm">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;