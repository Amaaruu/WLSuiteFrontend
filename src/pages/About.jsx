import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import Button from '../components/atoms/Button';
import { Sparkles, Target, ShieldCheck, Users, Zap, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-sapphire-100 font-sans">
      <Navbar />


      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sapphire-100/60 via-white to-white"></div>
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-bl from-sapphire-200/40 to-blue-100/30 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-sapphire-50 text-sapphire-700 text-xs font-bold mb-6 border border-sapphire-100 shadow-sm">
            NUESTRA HISTORIA
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-sapphire-950 mb-8 tracking-tight">
            Propulsando el futuro <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapphire-600 to-blue-500">
              digital de las PYMES
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            En <strong>WebLandingSuite</strong>, no solo creamos páginas. Democratizamos el acceso a la tecnología de punta para que cualquier emprendedor pueda validar sus sueños en el mercado real con la potencia de la Inteligencia Artificial.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100">
            <div className="text-center">
              <div className="text-4xl font-black text-sapphire-900 mb-1">400k+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">Usuarios</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-sapphire-900 mb-1">10M+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">Leads</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-sapphire-900 mb-1">24/7</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">Soporte IA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-sapphire-900 mb-1">99.9%</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-sapphire-900 rounded-3xl overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070" 
                  alt="Equipo WebLandingSuite" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sapphire-900 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-2xl shadow-xl hidden md:block border border-gray-100">
                <p className="text-sapphire-900 font-bold italic">"La velocidad es la nueva moneda de los negocios."</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-sapphire-950 tracking-tight">Cerrando la brecha entre la idea y la ejecución.</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nacimos de la frustración de ver proyectos increíbles morir por falta de recursos técnicos. En <strong>WebLandingSuite</strong>, hemos construido una suite de herramientas que permite a cualquier persona, sin importar sus conocimientos técnicos, lanzar una landing page profesional en menos de lo que tarda en tomarse un café.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-sapphire-100 rounded-lg flex items-center justify-center text-sapphire-600">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sapphire-900">Misión</h4>
                    <p className="text-sm text-gray-500">Acelerar el éxito empresarial mediante automatización inteligente.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-sapphire-100 rounded-lg flex items-center justify-center text-sapphire-600">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sapphire-900">Visión</h4>
                    <p className="text-sm text-gray-500">Ser el estándar global para la creación de activos digitales SaaS.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-sapphire-950 mb-4">Lo que nos define</h2>
          <p className="text-gray-500">Nuestros principios guían cada línea de código que escribimos.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {[
            { icon: <Zap />, title: "Velocidad Extrema", desc: "Priorizamos la agilidad para que valides tus ideas antes que la competencia." },
            { icon: <ShieldCheck />, title: "Calidad Pro", desc: "Cada diseño generado cumple con estándares internacionales de UX y conversión." },
            { icon: <Sparkles />, title: "IA Ética", desc: "Usamos inteligencia artificial para potenciar la creatividad humana, no para reemplazarla." },
            { icon: <Users />, title: "Foco en el Cliente", desc: "Tus metas de negocio son nuestra única métrica de éxito." },
            { icon: <Globe />, title: "Accesibilidad", desc: "Herramientas de nivel élite a precios diseñados para emprendedores." },
            { icon: <Target />, title: "Resultados", desc: "No buscamos 'likes', buscamos leads y ventas reales para tu proyecto." }
          ].map((value, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-sapphire-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sapphire-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-sapphire-950 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 bg-sapphire-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.2)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Sé parte de la revolución digital</h2>
          <p className="text-lg text-sapphire-100 mb-10 opacity-80 leading-relaxed">
            Estamos construyendo el futuro de la creación web y queremos que tu negocio sea el próximo caso de éxito de <strong>WebLandingSuite</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="px-10 py-4 bg-white text-sapphire-900 font-bold rounded-2xl hover:bg-sapphire-50 transition-all shadow-xl shadow-black/20">
                Unirme ahora
              </button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;