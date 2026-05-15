import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Users, FolderOpen, ScrollText, LogOut, Home, CreditCard } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Panel General',    path: '/admin',         icon: LayoutDashboard },
    { label: 'Usuarios',         path: '/admin/users',   icon: Users           },
    { label: 'Proyectos',        path: '/admin/projects', icon: FolderOpen     },
    { label: 'Planes',           path: '/admin/planes',  icon: CreditCard      },
    { label: 'Logs del Sistema', path: '/admin/logs',    icon: ScrollText      },
  ];

  const LinkItem = ({ item }) => (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        location.pathname === item.path
          ? 'bg-sapphire-600 text-white shadow-lg shadow-sapphire-600/20'
          : 'text-gray-500 hover:bg-gray-100 hover:text-sapphire-600'
      }`}
    >
      <item.icon size={20} />
      {item.label}
    </Link>
  );

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col p-6 fixed left-0 top-0">
      <div className="mb-10 px-2">
        <span className="text-xl font-black text-sapphire-950 tracking-tighter">
          WL<span className="text-sapphire-600">SUITE</span>
        </span>
      </div>

      <nav className="flex-grow space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Administración</p>
        {menuItems.map((item) => (
          <LinkItem key={item.path} item={item} />
        ))}
      </nav>

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
      </div>
    </aside>
  );
};

export default Sidebar;