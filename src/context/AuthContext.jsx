import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

const extractRoleFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload) return 'user';
  if (Array.isArray(payload.authorities)) {
    const auth = payload.authorities[0]?.authority || '';
    return auth.replace('ROLE_', '').toLowerCase();
  }
  if (typeof payload.role === 'string') {
    return payload.role.replace('ROLE_', '').toLowerCase();
  }
  return 'user';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setUser(null);
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedName = localStorage.getItem('userName');
      const storedUserId = localStorage.getItem('userId');

      if (token) {
        if (isTokenExpired(token)) {
          clearSession();
        } else {
          const role = extractRoleFromToken(token);
          setUser({
            name: storedName || 'Usuario',
            userId: storedUserId ? parseInt(storedUserId) : null,
            token,
            role,
          });
        }
      }
    } catch (error) {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    const handleAuthError = () => clearSession();
    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, [clearSession]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, name, userId } = response.data;

      if (!token) return { success: false, message: 'Respuesta del servidor inválida.' };

      localStorage.setItem('token', token);
      localStorage.setItem('userName', name);
      if (userId) localStorage.setItem('userId', String(userId));

      const role = extractRoleFromToken(token);
      setUser({ name, token, userId: userId || null, role });
      return { success: true, role };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al conectar con el servidor.';
      return { success: false, message: errorMessage };
    }
  };

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};