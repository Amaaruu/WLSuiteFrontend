import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Características', href: '#features' },
    { name: 'Precios', href: '#pricing' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="WebLandingSuite Logo" 
              className="h-10 w-auto object-contain" 
            />
            <span className="text-xl font-bold text-sapphire-900 tracking-tight hidden sm:block">
              WebLanding<span className="text-sapphire-600">Suite</span>
            </span>
          </div>

          {/* NAVEGACIÓN DESKTOP */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-sapphire-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-semibold text-sapphire-900 hover:text-sapphire-600 transition-colors">
              Iniciar Sesión
            </button>
            <Button variant="primary" className="text-sm py-2 px-5">
              Comenzar gratis
            </Button>
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

      {/* BARRA DE SEPARACIÓN*/}
      <div className="w-full h-[2px] bg-sapphire-900/10 shadow-sm" />

      {/* MENÚ MÓVIL */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-sapphire-600"
              >
                {link.name}
              </a>
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