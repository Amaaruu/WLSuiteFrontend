import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/WebLandingSuiteLogo.webp';
import { FaInstagram, FaTwitter, FaFacebook} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-sapphire-900 via-[#0a1120] to-[#05070a] pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-sapphire-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center p-2">
                <img 
                  src={logo} 
                  alt="WebLandingSuite Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">
                WebLanding<span className="text-blue-400">Suite.</span>
              </span>
            </div>
            <p className="text-sapphire-100/70 max-w-sm mb-8 leading-relaxed text-lg">
              Empoderando a emprendedores con herramientas de IA para dominar el mercado digital.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em]">Producto</h4>
            <ul className="space-y-3 text-sm text-sapphire-100/60">
              <li><Link to="/templates" className="hover:text-blue-400 transition-colors">Plantillas IA</Link></li>
              <li><Link to="/planes" className="hover:text-blue-400 transition-colors">Planes de Precios</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em]">Soporte</h4>
            <ul className="space-y-3 text-sm text-sapphire-100/60">
              <li><button className="hover:text-blue-400 transition-colors">Documentación</button></li>
              <li><Link to="/soporte" className="hover:text-blue-400 transition-colors">Soporte</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em]">Legal</h4>
            <ul className="space-y-3 text-sm text-sapphire-100/60">
              <li><button className="hover:text-blue-400 transition-colors">Términos</button></li>
              <li><button className="hover:text-blue-400 transition-colors">Privacidad</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-sapphire-200/40">
            © {new Date().getFullYear()} WebLandingSuite. Validando ideas en tiempo récord.
          </p>
          <div className="flex gap-4">
            {[
              { id: 'instagram', icon: <FaInstagram size={18} /> },
              { id: 'linkedin', icon: <FaTwitter size={18} /> },
              { id: 'facebook', icon: <FaFacebook size={18} /> },
            ].map((social) => (
              <div 
                key={social.id} 
                className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 hover:border-blue-400/50 transition-all cursor-pointer text-white/50 hover:text-blue-400"
              >
                {social.icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;