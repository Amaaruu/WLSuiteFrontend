import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import { 
  Target, Lightbulb, Rocket, Cpu, 
  Zap, Clock, ShieldCheck, Sparkles, Server, TerminalSquare,
  Coffee, Terminal, Globe, Heart, MapPin, Code2
} from 'lucide-react'; 

// --- 1. FONDO ANIMADO Y PATRÓN GRID ---
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-50">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <motion.div
      animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[128px]"
    />
    <motion.div
      animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-[128px]"
    />
  </div>
);
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const About = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden bg-slate-50">
      <Navbar />
      
      <main className="flex-grow relative">
        <AnimatedBackground />
        <section className="pt-40 pb-20 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto text-center">
              <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-blue-100 shadow-sm text-blue-600 font-semibold text-sm mb-8">
                <Sparkles size={16} className="text-blue-500" />
                <span>Revolucionando la creación web</span>
              </motion.div>
              
              <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter text-slate-900 leading-[1.1]">
                Construimos el <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  motor de internet
                </span>
              </motion.h1>
              
              <motion.p variants={fadeUpVariant} className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light mb-12">
                Nuestra misión es empoderar a miles de emprendedores eliminando la barrera técnica. Con <strong className="text-slate-900 font-semibold">WebLandingSuite</strong>, tu idea se convierte en código funcional en menos tiempo del que tardas en tomarte un café.
              </motion.p>

              {/* Estadísticas Rápidas */}
              <motion.div variants={fadeUpVariant} className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-200/60 max-w-4xl mx-auto">
                {[
                  { label: "Velocidad de carga", value: "< 1s" },
                  { label: "Ahorro de tiempo", value: "95%" },
                  { label: "Código limpio", value: "100%" },
                  { label: "Integración de IA", value: "Nativa" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <h4 className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.value}</h4>
                    <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 relative z-10 bg-white border-t border-slate-200 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInLeft} className="lg:w-1/3 lg:sticky lg:top-32 self-start">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm mb-6">
                  <Globe size={16} /> Nuestra Historia
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                  De la frustración a la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">revolución.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium">
                  Fundada por dos desarrolladores obsesionados con la eficiencia.
                </p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="lg:w-2/3 space-y-8 text-xl text-slate-600 leading-relaxed font-light">
                <motion.p variants={fadeUpVariant}>
                  Todo comenzó cuando vimos un patrón destructivo: emprendedores brillantes gastando todos sus ahorros y meses de su tiempo esperando a que una agencia les entregara una página web básica.
                </motion.p>
                <motion.p variants={fadeUpVariant}>
                  Como desarrolladores (Frontend y Backend), sabíamos que el proceso técnico era repetitivo. Escribíamos el mismo código una y otra vez. Nos preguntamos: <strong className="text-slate-900 font-semibold">¿Qué pasaría si le enseñamos a una Inteligencia Artificial a programar como nosotros?</strong>
                </motion.p>
                <motion.div variants={fadeUpVariant} className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 my-10 relative">
                  <Terminal className="absolute top-8 right-8 text-blue-200" size={64} opacity={0.5} />
                  <p className="text-blue-900 font-medium italic relative z-10">
                    "WebLandingSuite no es solo un generador de páginas. Es la suma de nuestros años de experiencia empaquetados en un motor de Python y una interfaz de React, trabajando incansablemente para ti."
                  </p>
                </motion.div>
                <motion.p variants={fadeUpVariant}>
                  Hoy, nuestro equipo trabaja todos los días para asegurar que la barrera tecnológica desaparezca. Creemos que si tienes una gran idea, internet debería ser tu aliado, no tu obstáculo.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 relative z-10 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div variants={slideInLeft} className="space-y-8">
                <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                  La forma antigua de crear páginas web <span className="text-red-500">está rota.</span>
                </h2>
                <div className="space-y-6 text-lg text-slate-600">
                  <p>
                    Contratar a una agencia toma meses y cuesta miles de dólares. Usar constructores visuales (drag & drop) resulta en código basura, páginas lentas y un SEO penalizado por Google.
                  </p>
                  <p>
                    Nosotros construimos una inteligencia artificial que actúa como tu equipo de desarrollo personal. Entiende tu negocio, diseña una interfaz atractiva y escribe el código fuente perfecto y optimizado.
                  </p>
                </div>
                <ul className="space-y-4 font-medium text-slate-700">
                  <li className="flex items-center gap-3"><Clock className="text-blue-500" /> De semanas a segundos.</li>
                  <li className="flex items-center gap-3"><Zap className="text-yellow-500" /> Rendimiento perfecto (Score 100).</li>
                  <li className="flex items-center gap-3"><ShieldCheck className="text-green-500" /> Arquitectura escalable y segura.</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
                <div className="bg-slate-900 rounded-3xl p-8 relative shadow-2xl overflow-hidden">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <pre className="text-sm font-mono text-blue-300">
                    <code>
                      <span className="text-purple-400">const</span> WLS_Engine = <span className="text-blue-400">new</span> AI_Generator();<br/><br/>
                      <span className="text-slate-400">// Generando arquitectura base...</span><br/>
                      <span className="text-emerald-400">await</span> WLS_Engine.analyzeNiche("SaaS");<br/>
                      <span className="text-emerald-400">await</span> WLS_Engine.buildComponents();<br/><br/>
                      <span className="text-slate-400">// Desplegando en la nube</span><br/>
                      <span className="text-purple-400">return</span> <span className="text-green-300">"¡Landing Page lista para vender!"</span>;
                    </code>
                  </pre>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 relative z-10 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Nuestros Pilares</h2>
              <p className="text-xl text-slate-600">En qué creemos y cómo trabajamos.</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Target/>, title: "Misión", desc: "Democratizar la tecnología web de alto rendimiento para que cualquier negocio pueda competir con los gigantes de la industria." },
                { icon: <Lightbulb/>, title: "Visión", desc: "Convertirnos en el estándar global para la generación de código y diseño automatizado impulsado por Inteligencia Artificial." },
                { icon: <Rocket/>, title: "Innovación", desc: "No nos conformamos con lo que existe. Investigamos e implementamos modelos de IA de última generación todos los días." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUpVariant} whileHover={{ y: -8 }} className="bg-slate-50 p-10 rounded-3xl shadow-sm border border-slate-200/60">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-24 relative z-10 bg-slate-900 text-white border-y border-slate-800">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeUpVariant}>
                <h2 className="text-4xl font-bold mb-6 text-white">Arquitectura de Clase Mundial</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  WebLandingSuite no es solo una interfaz bonita. Debajo del capó, utilizamos un ecosistema tecnológico robusto que garantiza seguridad, velocidad y escalabilidad.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><TerminalSquare size={24}/></div>
                    <div>
                      <h4 className="font-bold text-lg text-white">Frontend en React & Vite</h4>
                      <p className="text-slate-400 text-sm">Interfaces ultra rápidas, dinámicas y con animaciones de nivel de agencia de diseño.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/10 text-red-400 rounded-xl"><Server size={24}/></div>
                    <div>
                      <h4 className="font-bold text-lg text-white">Backend en Java Spring Boot</h4>
                      <p className="text-slate-400 text-sm">Núcleo sólido que maneja la seguridad JWT, pagos y conexión segura con bases de datos en la nube.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl"><Cpu size={24}/></div>
                    <div>
                      <h4 className="font-bold text-lg text-white">Python AI Engine</h4>
                      <p className="text-slate-400 text-sm">Microservicio dedicado que procesa peticiones de lenguaje natural para construir código real.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={slideInLeft} className="hidden md:block">
                <div className="relative w-full aspect-square bg-gradient-to-tr from-slate-800 to-slate-800/40 rounded-[3rem] border border-slate-700 p-8 flex flex-col justify-center gap-6 shadow-2xl">
                  <div className="h-16 w-full bg-slate-700/50 rounded-2xl border border-slate-600 flex items-center px-6 gap-4">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-mono text-slate-300">Cliente (React)</span>
                  </div>
                  <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-red-500 mx-auto opacity-50"></div>
                  <div className="h-16 w-full bg-slate-700/50 rounded-2xl border border-slate-600 flex items-center px-6 gap-4">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-mono text-slate-300">Servidor API (Java)</span>
                  </div>
                  <div className="w-1 h-12 bg-gradient-to-b from-red-500 to-yellow-500 mx-auto opacity-50"></div>
                  <div className="h-16 w-full bg-slate-700/50 rounded-2xl border border-slate-600 flex items-center px-6 gap-4">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="font-mono text-slate-300">Motor IA (Python)</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 relative z-10 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-6">El ADN de nuestro equipo</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                No somos una corporación aburrida. Somos ingenieros, diseñadores y soñadores construyendo el futuro del software.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <MapPin size={28}/>, title: "100% Remotos", desc: "Trabajamos desde donde somos más felices y creativos." },
                { icon: <Code2 size={28}/>, title: "Código Artesanal", desc: "La IA escribe rápido, pero nosotros supervisamos la arquitectura con lupa." },
                { icon: <Heart size={28}/>, title: "Centrados en el Usuario", desc: "Cada botón y animación se piensa para darte la mejor experiencia." },
                { icon: <Coffee size={28}/>, title: "Cafeína Driven", desc: "Transformamos litros de café en componentes de React y endpoints de Java." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUpVariant} whileHover={{ y: -8 }} className="bg-slate-50 p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-slate-900/20">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-24 relative z-10 bg-slate-900 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800">
              {[
                { number: "3", label: "Fundadores locos" },
                { number: "10k+", label: "Líneas de código limpias" },
                { number: "99%", label: "De automatización" },
                { number: "840", label: "Tazas de café servidas" }
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeUpVariant} className="text-center px-4">
                  <h4 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2">
                    {stat.number}
                  </h4>
                  <p className="text-sm md:text-base font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section>
          
        </section>
        

      </main>
      <Footer />
    </div>
  );
};

export default About;