import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_REVERSE_BID,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't auto-logout for 2FA toggle requests - let the component handle it
            const isTwoFAToggle = error.config?.url?.includes('/user/twofa');

            if (!isTwoFAToggle) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                localStorage.removeItem('authExpiration');
                //   window.location.href = '/unauthorized';
            }
        }
        return Promise.reject(error);
    }
);

export default api;