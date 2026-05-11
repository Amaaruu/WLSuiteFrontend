import axios from 'axios';

// Instancia global configurada con la URL del .env
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://landingbackend-s1rk.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor: Busca el JWT en el navegador y lo añade a la cabecera 'Authorization'
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);

export default api;