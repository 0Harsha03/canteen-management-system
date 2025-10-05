import axios from 'axios';

// Use deployed backend URL, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    studentId?: string;
  }) => api.post('/auth/register', userData),
  
  getMe: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
};

// Menu API
export const menuAPI = {
  getMenuItems: (params?: {
    category?: string;
    search?: string;
    vegetarian?: boolean;
    available?: boolean;
  }) => api.get('/menu', { params }),
  
  getMenuItem: (id: string) => api.get(`/menu/${id}`),
  
  getByCategory: (category: string) => api.get(`/menu/category/${category}`),
  
  createMenuItem: (data: any) => api.post('/menu', data),
  
  updateMenuItem: (id: string, data: any) => api.put(`/menu/${id}`, data),
  
  deleteMenuItem: (id: string) => api.delete(`/menu/${id}`),
  
  updateStock: (id: string, quantity: number) =>
    api.patch(`/menu/${id}/stock`, { quantity }),
  
  toggleAvailability: (id: string) => api.patch(`/menu/${id}/availability`),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData: {
    items: Array<{
      menuItem: string;
      quantity: number;
      specialInstructions?: string;
    }>;
    paymentMethod: string;
    specialRequests?: string;
  }) => api.post('/orders', orderData),
  
  getMyOrders: () => api.get('/orders/my-orders'),
  
  getOrder: (id: string) => api.get(`/orders/${id}`),
  
  getAllOrders: (params?: {
    status?: string;
    date?: string;
  }) => api.get('/orders', { params }),
  
  updateOrderStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/orders/${id}/status`, { status, notes }),
  
  cancelOrder: (id: string) => api.patch(`/orders/${id}/cancel`),
  
  rateOrder: (id: string, score: number, comment?: string) =>
    api.patch(`/orders/${id}/rate`, { score, comment }),
  
  getTodaysOrders: () => api.get('/orders/today'),
  
  getOrdersByStatus: (status: string) => api.get(`/orders/status/${status}`),
};

export default api;