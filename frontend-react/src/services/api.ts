// API service configuration for connecting with backend
// Use environment variable for production, fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    studentId?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Menu API
export const menuAPI = {
  getAll: async (filters?: {
    category?: string;
    available?: boolean;
    vegetarian?: boolean;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/menu?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/menu/category/${category}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (menuItem: any) => {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(menuItem),
    });
    return handleResponse(response);
  },

  update: async (id: string, menuItem: any) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(menuItem),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateStock: async (id: string, quantity: number) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}/stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  toggleAvailability: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}/availability`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: {
    items: Array<{
      menuItem: string;
      quantity: number;
      specialInstructions?: string;
    }>;
    paymentMethod: string;
    specialRequests?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  getMyOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAll: async (filters?: {
    status?: string;
    date?: string;
    customer?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/orders?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTodaysOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/today`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getByStatus: async (status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/status/${status}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateStatus: async (id: string, status: string, notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(response);
  },

  cancel: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  rate: async (id: string, score: number, comment?: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/rate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ score, comment }),
    });
    return handleResponse(response);
  },
};

export default {
  auth: authAPI,
  menu: menuAPI,
  orders: ordersAPI,
};