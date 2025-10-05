export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  phone?: string;
  studentId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages' | 'desserts' | 'combo-meals';
  price: number;
  image: string;
  ingredients: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: 'mild' | 'medium' | 'spicy' | 'very-spicy' | 'none';
  preparationTime: number;
  availability: {
    isAvailable: boolean;
    availableFrom: string;
    availableTo: string;
    daysOfWeek: string[];
  };
  stock: {
    quantity: number;
    lowStockThreshold: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  menuItem: string | MenuItem;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: string | User;
  items: OrderItem[];
  orderSummary: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: 'cash' | 'card' | 'digital-wallet' | 'student-credit';
  specialRequests?: string;
  estimatedPickupTime?: Date;
  actualPickupTime?: Date;
  preparationTime?: number;
  assignedStaff?: string | User;
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    updatedBy: string | User;
    notes?: string;
  }>;
  rating?: {
    score: number;
    comment: string;
    ratedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  studentId?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  errors?: string[];
}