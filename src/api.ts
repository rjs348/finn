import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface StudentLoginData {
    name: string;
    rollNumber: number;
    registerNumber: string;
    email: string;
}

export interface VerifyOtpData {
    registerNumber: string;
    otp: string;
}

export interface AdminLoginData {
    username: string;
    password: string;
}

export const auth = {
    studentLogin: (data: StudentLoginData) => api.post('/auth/student/send-otp', data),
    verifyOtp: (data: VerifyOtpData) => api.post('/auth/student/verify-otp', data),
    adminLogin: (data: AdminLoginData) => api.post('/auth/admin/login', data),
    adminForgotPassword: (email: string) => api.post('/auth/admin/forgot-password', { email }),
    adminVerifyResetToken: (token: string) => api.get(`/auth/admin/reset-password/${token}`),
    adminResetPassword: (token: string, password: string) => api.post('/auth/admin/reset-password', { token, password }),
};

export const candidates = {
    getAll: () => api.get('/candidates'),
    getAllAdmin: () => api.get('/candidates/all'),
    add: (data: FormData | object) => api.post('/candidates', data),
    update: (id: string, data: object) => api.put(`/candidates/${id}`, data),
    delete: (id: string) => api.delete(`/candidates/${id}`),
};

export const vote = {
    cast: (candidateId: string) => api.post('/vote', { candidateId }),
};

export const admin = {
    getDashboard: () => api.get('/admin/dashboard'),
    toggleElection: () => api.put('/admin/election-status'),
};

export const election = {
    getStatus: () => api.get('/election/status'),
};

export const chatbot = {
    message: (message: string) => api.post('/chatbot', { message }),
};

export default api;
