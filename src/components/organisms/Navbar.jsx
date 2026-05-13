import React, { useState, useEffect, useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../atoms/Button';
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
    { name: 'Inicio',     path: '/' },
    { name: 'Plantillas', path: '/templates' },
    { name: 'Nosotros',   path: '/about' },
    { name: 'Planes',     path: '/planes' },
    { name: 'Contacto',   path: '/contacto' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <img src={logo} alt="WebLandingSuite Logo" className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold text-sapphire-900 tracking-tight hidden sm:block">
              WebLanding<span className="text-sapphire-600">Suite</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-gray-600 hover:text-sapphire-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="text-sm font-semibold text-sapphire-900 hover:text-sapphire-600 transition-colors"
                >
                  {isAdmin ? 'Panel Admin' : `Hola, ${userName}`}
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-sm py-2 px-4 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-sm font-semibold text-sapphire-900 hover:text-sapphire-600 transition-colors">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="text-sm py-2 px-5">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-sapphire-900 p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-[2px] bg-sapphire-900/10 shadow-sm" />

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-sapphire-600"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-semibold text-sapphire-900 text-center"
                  >
                    {isAdmin ? 'Panel Admin' : 'Mi Dashboard'}
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Registrarse</Button>
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