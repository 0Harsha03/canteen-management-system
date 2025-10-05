import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "@/services/api";

type UserRole = "customer" | "staff" | "admin";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  studentId?: string;
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for existing token and user data
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          // Verify token is still valid before setting user state
          try {
            await authAPI.getCurrentUser();
            // Token is valid, set user state
            setUser(userData);
            setUserRole(userData.role);
          } catch (error) {
            // Token is invalid, clear local storage
            console.log('Token expired or invalid, clearing auth state');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setUserRole(null);
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const userData = await authAPI.register({
        name: fullName,
        email,
        password,
        role: 'customer', // Default role for new signups
      });
      
      if (userData.user) {
        setUser(userData.user);
        setUserRole(userData.user.role);
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await authAPI.login(email, password);
      
      if (data.user) {
        setUser(data.user);
        setUserRole(data.user.role);
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and storage
      setUser(null);
      setUserRole(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Navigation will be handled by route guards
      window.location.href = '/auth';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};