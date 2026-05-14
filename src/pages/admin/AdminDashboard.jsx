import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/organisms/Sidebar';
import StatCard from '../../components/molecules/StatCard';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: null, projects: null, ready: null, failed: null });

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          api.get('/users'),
          api.get('/projects?size=500'),
        ]);
        const users = Array.isArray(usersRes.data) ? usersRes.data.length : usersRes.data.totalElements ?? 0;
        const content = projectsRes.data.content || [];
        const projects = projectsRes.data.totalElements ?? content.length;
        const ready  = content.filter(p => p.status?.toUpperCase() === 'READY').length;
        const failed = content.filter(p => p.status?.toUpperCase() === 'FAILED').length;
        setStats({ users, projects, ready, failed });
      } catch {
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Panel de administración</h1>
            <p className="text-gray-500 mt-1">Visión global del sistema.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Usuarios" value={stats.users} sublabel="Total registrados" to="/admin/users" />
            <StatCard label="Proyectos" value={stats.projects} sublabel="Total generados" to="/admin/projects" />
            <StatCard label="Completados" value={stats.ready} sublabel="Estado Ready" />
            <StatCard label="Con error" value={stats.failed} sublabel="Estado Failed" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/users"
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-sapphire-200 transition-colors"
            >
              <p className="font-semibold text-gray-800 mb-1">Gestión de usuarios</p>
              <p className="text-sm text-gray-400">Ver, editar y eliminar usuarios registrados.</p>
            </Link>
            <Link
              to="/admin/projects"
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-sapphire-200 transition-colors"
            >
              <p className="font-semibold text-gray-800 mb-1">Gestión de proyectos</p>
              <p className="text-sm text-gray-400">Ver todos los proyectos generados por la IA.</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;