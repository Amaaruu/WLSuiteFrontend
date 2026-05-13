import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  ShieldCheck,
  Users,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = user?.role ? String(user.role).toUpperCase().trim() : '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Mis Proyectos', path: '/dashboard', icon: LayoutDashboard, roles: ['USER', 'ADMIN'] },
    { label: 'Nueva Landing', path: '/planes', icon: PlusCircle, roles: ['USER', 'ADMIN'] },
  ];

  const adminItems = [
    { label: 'Panel General', path: '/admin', icon: ShieldCheck, roles: ['ADMIN'] },
    { label: 'Usuarios', path: '/admin/users', icon: Users, roles: ['ADMIN'] },
    { label: 'Logs del Sistema', path: '/admin/logs', icon: Activity, roles: ['ADMIN'] },
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
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Menú Principal</p>
        
        {menuItems.filter(i => i.roles.includes(userRole)).map((item) => (
          <LinkItem key={item.path} item={item} />
        ))}

        {userRole === 'ADMIN' && (
          <div className="pt-8 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Administración</p>
            {adminItems.map((item) => <LinkItem key={item.path} item={item} />)}
          </div>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-sapphire-100 flex items-center justify-center text-sapphire-700 font-bold uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Usuario'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;