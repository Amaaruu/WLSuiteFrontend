import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import api from '../../services/api';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/support/tickets').catch(() => ({ data: [] }));
        setTickets(response.data || []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">Centro de Soporte</h1>
<<<<<<< Updated upstream
          <p className="text-gray-500">Gestiona los mensajes y consultas de los usuarios.</p>
=======
          <p className="text-gray-500">Gestiona las consultas de los usuarios.</p>
>>>>>>> Stashed changes
        </header>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-8 py-4">Usuario</th>
                <th className="px-8 py-4">Asunto / Mensaje</th>
                <th className="px-8 py-4">Fecha</th>
                <th className="px-8 py-4">Estado</th>
                <th className="px-8 py-4">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sapphire-600 border-t-transparent"></div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
<<<<<<< Updated upstream
                  <td colSpan="5" className="px-8 py-12 text-center text-gray-500 font-medium">
                    No hay mensajes de soporte pendientes.
=======
                  <td colSpan="5" className="px-8 py-12 text-center text-gray-500">
                    No hay mensajes de soporte.
>>>>>>> Stashed changes
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
<<<<<<< Updated upstream
                  <tr key={ticket.id || Math.random()} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900">{ticket.userName || 'Usuario'}</p>
                      <p className="text-xs text-gray-400">{ticket.userEmail || 'Sin email'}</p>
=======
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900">{ticket.userName}</p>
                      <p className="text-xs text-gray-400">{ticket.userEmail}</p>
>>>>>>> Stashed changes
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-gray-700 truncate max-w-xs">{ticket.message}</p>
                    </td>
                    <td className="px-8 py-5 text-gray-500 text-sm">
<<<<<<< Updated upstream
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
=======
                      {new Date(ticket.createdAt).toLocaleDateString()}
>>>>>>> Stashed changes
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ticket.status === 'open' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
<<<<<<< Updated upstream
                        {ticket.status === 'open' ? 'Pendiente' : 'Resuelto'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button className="text-sapphire-600 font-bold text-sm hover:underline">Responder</button>
=======
                        {ticket.status === 'open' ? 'Abierto' : 'Cerrado'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sapphire-600 font-bold text-sm cursor-pointer hover:underline">
                      Responder
>>>>>>> Stashed changes
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminSupport;