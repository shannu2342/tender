import axios from 'axios';

// Create axios instance
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const customerApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

customerApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('customerToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (oldPassword, newPassword) =>
        api.put('/auth/change-password', { oldPassword, newPassword })
};

// Pages Services
export const pagesService = {
    getPages: () => api.get('/pages'),
    getPage: (pageType) => api.get(`/pages/${pageType}`),
    getAllPages: () => api.get('/pages/admin/all'),
    createPage: (data) => api.post('/pages', data),
    updatePage: (pageType, data) => api.put(`/pages/${pageType}`, data),
    togglePageStatus: (pageType, isEnabled) =>
        api.put(`/pages/${pageType}/status`, { isEnabled }),
    deletePage: (pageType) => api.delete(`/pages/${pageType}`)
};

// Services Services
export const servicesService = {
    getServices: (params) => api.get('/services', { params }),
    getServiceBySlug: (slug) => api.get(`/services/slug/${slug}`),
    getAllServices: (params) => api.get('/services/admin/all', { params }),
    createService: (data) => api.post('/services', data),
    updateService: (id, data) => api.put(`/services/${id}`, data),
    toggleServiceStatus: (id, isEnabled) =>
        api.put(`/services/${id}/status`, { isEnabled }),
    deleteService: (id) => api.delete(`/services/${id}`),
    getCategories: () => api.get('/services/categories')
};

// Tenders Services
export const tendersService = {
    getTenders: (params) => api.get('/tenders', { params }),
    getTenderById: (id) => api.get(`/tenders/${id}`),
    getAllTenders: (params) => api.get('/tenders/admin/all', { params }),
    createTender: (data) => api.post('/tenders', data),
    updateTender: (id, data) => api.put(`/tenders/${id}`, data),
    toggleTenderStatus: (id, statusData) =>
        api.put(`/tenders/${id}/status`, statusData),
    deleteTender: (id) => api.delete(`/tenders/${id}`),
    getStats: () => api.get('/tenders/admin/stats'),
    getCategories: () => api.get('/tenders/categories'),
    getStates: () => api.get('/tenders/states')
};

// Blogs Services
export const blogsService = {
    getBlogs: (params) => api.get('/blogs', { params }),
    getBlogBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
    getAllBlogs: (params) => api.get('/blogs/admin/all', { params }),
    createBlog: (data) => api.post('/blogs', data),
    updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
    toggleBlogStatus: (id, statusData) =>
        api.put(`/blogs/${id}/status`, statusData),
    deleteBlog: (id) => api.delete(`/blogs/${id}`),
    addComment: (id, data) => api.post(`/blogs/${id}/comments`, data),
    getCategories: () => api.get('/blogs/categories'),
    getTags: () => api.get('/blogs/tags')
};

// Enquiries Services
export const enquiriesService = {
    createEnquiry: (data) => api.post('/enquiries', data),
    getEnquiries: (params) => api.get('/enquiries', { params }),
    getEnquiryById: (id) => api.get(`/enquiries/${id}`),
    updateStatus: (id, data) => api.put(`/enquiries/${id}/status`, data),
    addNote: (id, data) => api.post(`/enquiries/${id}/notes`, data),
    deleteEnquiry: (id) => api.delete(`/enquiries/${id}`),
    exportToCSV: (params) =>
        api.get('/enquiries/export/csv', {
            params,
            responseType: 'blob'
        }),
    getStats: () => api.get('/enquiries/stats')
};

// Users Services
export const usersService = {
    getUsers: (params) => api.get('/users', { params }),
    getUserById: (id) => api.get(`/users/${id}`),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    toggleUserStatus: (id, isActive) =>
        api.put(`/users/${id}/status`, { isActive }),
    deleteUser: (id) => api.delete(`/users/${id}`),
    getStats: () => api.get('/users/stats'),
    getActivityReport: (params) => api.get('/users/activity/report', { params }),
    getPayments: (id) => api.get(`/users/${id}/payments`),
    verifyUser: (id) => api.put(`/users/${id}/verify`)
};

export const customerAuthService = {
    requestOtp: (mobile) => api.post('/customer-auth/request-otp', { mobile }),
    verifyOtp: (payload) => api.post('/customer-auth/verify-otp', payload),
    login: (payload) => api.post('/customer-auth/login', payload),
    requestSignupOtp: (payload) => api.post('/customer-auth/signup/request-otp', payload),
    verifySignupOtp: (payload) => api.post('/customer-auth/signup/verify-otp', payload),
    requestForgotOtp: (payload) => api.post('/customer-auth/forgot/request-otp', payload),
    verifyForgotOtp: (payload) => api.post('/customer-auth/forgot/verify-otp', payload),
    getProfile: () => customerApi.get('/customer-auth/me'),
    logout: () => customerApi.post('/customer-auth/logout')
};

export const paymentsService = {
    getPlans: () => api.get('/payments/plans'),
    createOrder: (payload = {}) => customerApi.post('/payments/create-order', payload),
    verifyOrder: (payload) => customerApi.post('/payments/verify', payload),
    getMyPayments: () => customerApi.get('/payments/my')
};

export default api;
