import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const auth = {
    login: (credentials) => api.post('/users/login', credentials),
    register: (userData) => api.post('/users/register', userData),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
};

export const projects = {
    getAll: (params) => api.get('/projects', { params }),
    getById: (id) => api.get(`/projects/${id}`),
    getCritical: () => api.get('/projects/critical'),
    create: (data) => api.post('/projects', data),
    getStatistics: (id) => api.get(`/analytics/project/${id}/statistics`),
    getSimulations: (id) => api.get(`/analytics/project/${id}/simulations`),
};

export const map = {
    getData: () => api.get('/map/data'),
    getRegionDetails: (id) => api.get(`/map/regions/${id}`),
};

export const analytics = {
    getUserDashboard: (userId) => api.get(`/analytics/user/${userId}/dashboard`),
    getInsights: (userId) => api.get(`/analytics/user/${userId}/insights`),
    getMaintenance: (userId) => api.get(`/analytics/user/${userId}/maintenance`),
};

export const news = {
    getFeed: () => api.get('/news/feed'),
    getUserIncidents: () => api.get('/news/dashboard'),
    getProjectIncidents: (projectId) => api.get(`/news/project/${projectId}`),
};

export const recommendations = {
    getUserRecommendations: (userId) => api.get(`/recommendations/user/${userId}/all`),
    getActive: (projectId) => api.get(`/recommendations/project/${projectId}/active`),
    getSignals: (projectId) => api.get(`/recommendations/project/${projectId}/signals`),
};

export default api;
