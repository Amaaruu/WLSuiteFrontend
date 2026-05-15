import React, { useState, useEffect, useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/WebLandingSuiteLogo.webp';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAuthenticated = !!user;
  const userName = user?.name || '';
  const isAdmin = user?.role === 'admin';
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Plantillas', path: '/templates' },
    { name: 'Nosotros', path: '/about' },
    { name: 'Planes', path: '/planes' },
    { name: 'Soporte', path: '/soporte' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-sapphire-950/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
        : 'bg-gradient-to-b from-sapphire-950/80 to-transparent backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5 group-hover:bg-white/20 transition-all duration-300 shadow-inner">
              <img src={logo} alt="WebLandingSuite Logo" className="w-full h-full object-contain" />
              <div className="absolute inset-0 rounded-xl bg-sapphire-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-black text-white tracking-tight hidden sm:block">
              WebLanding<span className="text-sapphire-400">Suite</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/10 group"
              >
                {link.name}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-sapphire-400 rounded-full group-hover:w-4 transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 hover:border-white/25 transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-sapphire-500/50 border border-sapphire-400/40 flex items-center justify-center text-white font-bold text-xs uppercase">
                    {userName.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                    {isAdmin ? 'Panel Admin' : userName}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/30">
                      ADMIN
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-red-300/80 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 hover:bg-red-500/10 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-sm font-semibold text-white/70 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link to="/register">
                  <button className="text-sm font-bold text-white px-5 py-2.5 rounded-xl bg-sapphire-600 hover:bg-sapphire-500 border border-sapphire-500/50 hover:border-sapphire-400 shadow-lg shadow-sapphire-900/30 hover:shadow-sapphire-600/30 transition-all duration-200 hover:-translate-y-0.5">
                    Registrarse
                  </button>
                </Link>
              </>
            )}
          </div>

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

      {isMobileMenuOpen && (
        <div className="md:hidden bg-sapphire-950/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-white/10 mt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sapphire-500/50 flex items-center justify-center text-white font-bold text-sm uppercase">
                      {userName.charAt(0)}
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
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-3 text-white/70 font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                      Iniciar Sesión
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-3 bg-sapphire-600 text-white font-bold rounded-xl hover:bg-sapphire-500 transition-all">
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