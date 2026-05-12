// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');

    if (token) {
      setUser({
        name: storedName || 'Usuario',
        token,
        userId: storedUserId ? parseInt(storedUserId) : null,
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, name, userId } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', name);
      if (userId) localStorage.setItem('userId', userId);

      setUser({ name, token, userId: userId || null });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al conectar con el servidor.';
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};