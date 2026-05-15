import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
<<<<<<< Updated upstream
import { LayoutDashboard, Users, FolderOpen, ScrollText, LogOut, Home, Headphones } from 'lucide-react';
=======
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  ClipboardList, 
  LifeBuoy, 
  LogOut,
  Sparkles
} from 'lucide-react';
>>>>>>> Stashed changes

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

<<<<<<< Updated upstream
  const menuItems = [
    { label: 'Panel General', path: '/admin', icon: LayoutDashboard },
    { label: 'Usuarios', path: '/admin/users', icon: Users },
    { label: 'Proyectos', path: '/admin/projects', icon: FolderOpen },
    { label: 'Logs del Sistema', path: '/admin/logs', icon: ScrollText },
    { label: 'Soporte', path: '/admin/support', icon: Headphones },
=======
  const isAdmin = user?.role === 'admin';

  const menuItems = isAdmin ? [
    { icon: LayoutDashboard, label: 'Panel General', path: '/admin' },
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
    { icon: Layers, label: 'Proyectos IA', path: '/admin/projects' },
    { icon: LifeBuoy, label: 'Tickets Soporte', path: '/admin/support' },
    { icon: ClipboardList, label: 'Logs Sistema', path: '/admin/logs' },
  ] : [
    { icon: LayoutDashboard, label: 'Mis Proyectos', path: '/dashboard' },
    { icon: Sparkles, label: 'Crear Landing', path: '/planes' },
    { icon: LifeBuoy, label: 'Soporte', path: '/soporte' },
>>>>>>> Stashed changes
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex flex-col">
      <div className="p-8">
        <img src="/WebLandingSuiteLogo.webp" alt="Logo" className="h-8 w-auto" />
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all
              ${isActive 
                ? 'bg-sapphire-50 text-sapphire-600' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
            `}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

<<<<<<< Updated upstream
      <div className="mt-auto pt-5 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-gray-50 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-sapphire-100 flex items-center justify-center text-sapphire-700 font-bold uppercase text-sm flex-shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate leading-tight">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
          >
            <Home size={14} />
            Inicio
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-colors border border-red-100"
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
=======
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
>>>>>>> Stashed changes
      </div>
    </aside>
  );
};

export default Sidebar;