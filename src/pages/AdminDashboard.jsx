import React, { useState, useEffect } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import api from '../services/api';
import { Users, Layout, Activity, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, projects: 0, logs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [u, p, l] = await Promise.all([
          api.get('/users'),
          api.get('/projects'),
          api.get('/logs')
        ]);
        setStats({
          users: u.data.length || 0,
          projects: p.data.totalElements || p.data.length || 0,
          logs: l.data.length || 0
        });
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon size={24} className="text-white" />
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-4xl font-black text-sapphire-950 mt-2">{value}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <header className="mb-12">
          <h1 className="text-3xl font-black text-sapphire-950">Panel de Administración</h1>
          <p className="text-gray-500">Métricas globales y salud del sistema.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Usuarios" value={stats.users} icon={Users} color="bg-blue-600" />
          <StatCard title="Landings" value={stats.projects} icon={Layout} color="bg-indigo-600" />
          <StatCard title="Eventos" value={stats.logs} icon={Activity} color="bg-sapphire-600" />
        </div>

        <div className="mt-12 bg-sapphire-900 rounded-3xl p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Sistema Operativo</h2>
            <p className="opacity-80">La conexión con los servicios de IA y Base de Datos es estable.</p>
          </div>
          <ShieldCheck className="absolute right-[-20px] bottom-[-20px] text-white opacity-10" size={200} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;