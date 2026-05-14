import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import StatCard from '../../components/molecules/StatCard';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: null, projects: null });

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          api.get('/users'),
          api.get('/projects?size=500'),
        ]);
        const users = Array.isArray(usersRes.data) ? usersRes.data.length : usersRes.data.totalElements ?? 0;
        const projects = projectsRes.data.totalElements ?? (projectsRes.data.content || []).length;
        setStats({ users, projects });
      } catch {}
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

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Usuarios" value={stats.users} sublabel="Total registrados" to="/admin/users" />
            <StatCard label="Proyectos" value={stats.projects} sublabel="Total generados" to="/admin/projects" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;