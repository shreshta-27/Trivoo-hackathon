import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if 401
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/landing';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const auth = {
    login: (credentials) => api.post('/users/login', credentials),
    register: (userData) => api.post('/users/register', userData),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    uploadAvatar: (formData) => api.put('/users/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    googleLogin: (token) => api.get('/auth/google', { headers: { Authorization: `Bearer ${token}` } }), // Google might still be on /auth/google ? 
};

// Analytics API
export const analytics = {
    getUserDashboard: (userId) => api.get(`/analytics/user/${userId}/dashboard`),
    getProjectStats: (projectId) => api.get(`/analytics/project/${projectId}/statistics`),
    getInsights: (userId) => api.get(`/analytics/user/${userId}/insights`),
    getMaintenance: (userId) => api.get(`/analytics/user/${userId}/maintenance`),
    getSimulations: (projectId) => api.get(`/analytics/project/${projectId}/simulations`)
};

// Map API
export const map = {
    getData: () => api.get('/map/data'),
    getRegion: (id) => api.get(`/map/regions/${id}`)
};

// Projects API
export const projects = {
    getAll: () => api.get('/projects'),
    getCritical: () => api.get('/projects/critical'),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    updateHealth: (id, data) => api.patch(`/projects/${id}/health`, data),
    delete: (id) => api.delete(`/projects/${id}`)
};

// Recommendations API
export const recommendations = {
    getUserRecommendations: (userId) => api.get(`/recommendations/user/${userId}/all`),
    getProjectRecommendations: (projectId) => api.get(`/recommendations/project/${projectId}/active`),
    triggerForProject: (projectId) => api.post(`/recommendations/project/${projectId}/trigger`),
    markComplete: (recommendationId, data) => api.post(`/recommendations/${recommendationId}/complete`, data),
    getRiskSignals: (projectId) => api.get(`/recommendations/project/${projectId}/signals`)
};

// News API
export const news = {
    getDashboard: () => api.get('/news/dashboard'),
    getProjectIncidents: (projectId) => api.get(`/news/project/${projectId}`),
    getFeed: () => api.get('/news/feed'),
    trigger: () => api.post('/news/trigger')
};

// Lifecycle API
export const lifecycle = {
    getMaintenance: (projectId) => api.get(`/charts/maintenance/${projectId}`),
    getProjectStats: (userId) => api.get(`/charts/projects/${userId}`)
};

// Crops API
export const crops = {
    getRecommendations: (params) => api.get('/crops/recommendations', { params }),
    getRegionRecommendations: (params) => api.get('/crops/region', { params }),
    getAll: () => api.get('/crops/crops'),
    getById: (id) => api.get(`/crops/crops/${id}`),
    compare: (data) => api.post('/crops/compare', data)
};

// Planting API
export const planting = {
    createSession: (data) => api.post('/planting', data),
    getNearby: (params) => api.get('/planting/nearby', { params }),
    joinSession: (id) => api.put(`/planting/${id}/join`),
    getSpecies: () => api.get('/planting/species')
};

// Suitability API
export const suitability = {
    assess: (data) => api.post('/suitability/assess', data)
};

export default api;
