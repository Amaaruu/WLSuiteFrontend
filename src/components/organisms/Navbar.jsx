import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import logo from '../../assets/WebLandingSuiteLogo.webp';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Actualizamos las rutas del menú
  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Características', path: '/#features' },
    { name: 'Plantillas', path: '/templates' }, // <-- Nueva ruta para plantillas
    { name: 'Planes', path: '/planes' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <img src={logo} alt="WebLandingSuite Logo" className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold text-sapphire-900 tracking-tight hidden sm:block">
              WebLanding<span className="text-sapphire-600">Suite</span>
            </span>
          </Link>

          {/* NAVEGACIÓN DESKTOP */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path} // <-- 3. Usamos <Link to="..."> en lugar de <a href="...">
                className="text-sm font-medium text-gray-600 hover:text-sapphire-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-semibold text-sapphire-900 hover:text-sapphire-600 transition-colors">
              Iniciar Sesión
            </button>
            <Link to="/register">
            <Button variant="primary" className="text-sm py-2 px-5">
              Registrarse
            </Button>
            </Link>
          </div>

          {/* BOTÓN MÓVIL */}
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

      {/* MENÚ MÓVIL */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
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
              <Button variant="outline" className="w-full">Iniciar Sesión</Button>
              <Button variant="primary" className="w-full">Registrarse</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;