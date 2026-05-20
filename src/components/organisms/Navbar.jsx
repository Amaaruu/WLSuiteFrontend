import React, { useState, useEffect, useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/WebLandingSuiteLogo.webp';

const AVATAR_GRADIENTS = [
  'from-violet-500 to-purple-700',
  'from-blue-500 to-indigo-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-cyan-700',
  'from-fuchsia-500 to-violet-700',
  'from-lime-500 to-green-700',
];

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useContext(AuthContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu,     setShowUserMenu]     = useState(false);

  // Cierra los menús si el usuario cambia de página
  useEffect(() => {
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Cierra el menú de usuario si hace clic afuera
  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e) => {
      if (!e.target.closest('#user-menu-wrapper')) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showUserMenu]);

  const handleLogout = () => { logout(); navigate('/'); };

  const isAuthenticated = !!user;
  const userName        = user?.name || '';
  const userInitial     = userName.charAt(0).toUpperCase() || '?';
  const isAdmin         = user?.role === 'admin';
  const dashboardPath   = isAdmin ? '/admin' : '/dashboard';
  const avatarGradient  = AVATAR_GRADIENTS[userInitial.charCodeAt(0) % AVATAR_GRADIENTS.length];

  const navLinks = [
    { name: 'Inicio',     path: '/' },
    { name: 'Plantillas', path: '/templates' },
    { name: 'Nosotros',   path: '/about' },
    { name: 'Planes',     path: '/planes' },
    { name: 'Soporte',    path: '/soporte' },
  ];

  return (
    // AQUÍ ESTÁ EL FONDO AZUL OSCURO ORIGINAL (bg-sapphire-950) SÓLIDO
    <nav className="fixed top-0 left-0 w-full z-50 bg-sapphire-950 shadow-md text-white transition-all duration-300 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5 group-hover:bg-white/20 transition-all duration-300">
              <img src={logo} alt="WebLandingSuite Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black text-white tracking-tight hidden sm:block">
              WebLanding<span className="text-sapphire-400">Suite</span>
            </span>
          </Link>
          
          {/* LINKS DE ESCRITORIO */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  location.pathname === link.path
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-sapphire-400 rounded-full transition-all duration-300 ${
                  location.pathname === link.path ? 'w-4' : 'w-0 group-hover:w-4'
                }`} />
              </Link>
            ))}
          </div>

          {/* BOTONES DE ACCIÓN (ESCRITORIO) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div id="user-menu-wrapper" className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0 border border-white/10`}>
                    {userInitial}
                  </div>
                  <div className="flex flex-col items-start leading-none gap-0.5">
                    <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">
                      {isAdmin ? 'Administrador' : 'Mi cuenta'}
                    </span>
                    <span className="text-sm font-bold text-white/90">
                      {isAdmin ? 'Panel Admin' : userName}
                    </span>
                  </div>
                  <svg
                    width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-white/30 ml-1 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                
                {/* DROPDOWN DEL USUARIO (Estilo Claro Profesional) */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white border border-slate-100 shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-base shadow-sm`}>
                          {userInitial}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{userName}</p>
                          <p className="text-xs text-slate-500">{user?.email || ''}</p>
                          {isAdmin && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sapphire-100 text-sapphire-700 mt-1 inline-block">
                              ADMIN
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        to={dashboardPath}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-sapphire-700 hover:bg-sapphire-50 transition-all"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                        </svg>
                        {isAdmin ? 'Panel de administración' : 'Mi dashboard'}
                      </Link>
                      {!isAdmin && (
                        <Link
                          to="/dashboard/projects"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-sapphire-700 hover:bg-sapphire-50 transition-all"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                          </svg>
                          Mis proyectos
                        </Link>
                      )}
                      <Link
                        to="/planes"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-sapphire-700 hover:bg-sapphire-50 transition-all"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        Ver planes
                      </Link>
                    </div>
                    <div className="p-1.5 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-sm font-semibold text-white/70 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link to="/register">
                  <button className="text-sm font-bold text-white px-5 py-2.5 rounded-xl bg-sapphire-600 hover:bg-sapphire-500 border border-sapphire-500/50 shadow-lg shadow-sapphire-900/30 transition-all duration-200 hover:-translate-y-0.5">
                    Registrarse
                  </button>
                </Link>
              </>
            )}
          </div>
          
          {/* TOGGLE MÓVIL */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-sapphire-950 border-t border-white/10 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-all ${
                  location.pathname === link.path
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-white/10 mt-3">
              {isAuthenticated ? (
                <>
                  <Link to={dashboardPath} className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm`}>
                      {userInitial}
                    </div>
                    <span className="text-white font-semibold">{isAdmin ? 'Panel Admin' : userName}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-300 border border-red-500/30 hover:bg-red-500/10 transition-all font-semibold"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="w-full py-3 text-white/70 font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                      Iniciar Sesión
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="w-full py-3 bg-sapphire-600 text-white font-bold rounded-xl hover:bg-sapphire-500 shadow-md transition-all">
                      Registrarse
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;