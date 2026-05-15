import React, { useState } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import { Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

const AdminSupport = () => {
  const [formData, setFormData] = useState({ subject: '', message: '', priority: 'normal' });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setFormData({ subject: '', message: '', priority: 'normal' });
      setTimeout(() => setSent(false), 4000);
    }, 1200);
  };

  const infoItems = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email de soporte técnico',
      value: 'soporte@weblandingsuite.com',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Horario de atención',
      value: 'Lunes a Viernes, 9:00 – 18:00 (CLT)',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Sede Central',
      value: 'Santiago, Chile',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <div className="max-w-5xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <MessageSquare className="text-sapphire-600" size={28} />
              Soporte del Sistema
            </h1>
            <p className="text-gray-500 mt-1">Canal de comunicación interno para el equipo administrador.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
                  Información de contacto
                </h2>
                {infoItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-sapphire-50 rounded-xl flex items-center justify-center text-sapphire-600 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{item.title}</p>
                      <p className="text-sm font-medium text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-sapphire-50 border border-sapphire-100 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-sapphire-800 mb-2">Recursos disponibles</h3>
                <ul className="space-y-2 text-sm text-sapphire-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sapphire-400 flex-shrink-0" />
                    Documentación técnica del sistema
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sapphire-400 flex-shrink-0" />
                    Guías de configuración del backend
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sapphire-400 flex-shrink-0" />
                    Logs del sistema en tiempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sapphire-400 flex-shrink-0" />
                    Panel de monitoreo de proyectos
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-5">
                Enviar mensaje interno
              </h2>

              {sent && (
                <div className="mb-5 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-100">
                  ✓ Mensaje enviado correctamente.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Asunto</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Describe brevemente el problema o consulta"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sapphire-200 focus:border-sapphire-500 outline-none transition-all bg-gray-50/50 focus:bg-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Prioridad</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sapphire-200 focus:border-sapphire-500 outline-none transition-all bg-gray-50/50 focus:bg-white text-sm"
                  >
                    <option value="baja">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Mensaje</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Detalla el problema, incluyendo pasos para reproducirlo si aplica..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sapphire-200 focus:border-sapphire-500 outline-none transition-all bg-gray-50/50 focus:bg-white text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 bg-sapphire-600 hover:bg-sapphire-700 text-white font-bold rounded-xl transition-all text-sm disabled:opacity-60"
                >
                  {isSending ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSupport;